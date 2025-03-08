// src/app/flow-memorization/flow-memorization.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BIBLE_DATA, BibleBook } from '../bible-tracker/models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-flow-memorization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flow-memorization.component.html',
  styleUrls: ['./flow-memorization.component.css'] // Updated to .css from .scss
})
export class FlowMemorizationComponent implements OnInit {
  input: string = '';
  output: string = '';
  isLoading: boolean = false;
  isProcessed: boolean = false;
  verses: any[] = [];

  // Bible selection filters
  testaments: string[] = [];
  availableGroups: string[] = [];
  availableBooks: string[] = [];
  availableChapters: string[] = [];

  selectedTestament: string = 'Old Testament';
  selectedGroup: string = 'Wisdom';
  selectedBook: string = 'Psalms';
  chapter: string = '23';

  ngOnInit(): void {
    this.initializeBibleFilters();
    this.handleFormat();
  }

  // Initialize filter values for Testament, Group, Book, and Chapter selection
  initializeBibleFilters(): void {
    // Get all testaments and manually sort to put Old Testament first
    const testamentSet = new Set(Object.values(BIBLE_DATA).map(book => book.testament));
    this.testaments = Array.from(testamentSet).sort((a, b) => {
      // Make sure Old Testament comes before New Testament
      if (a.includes('Old') && b.includes('New')) return -1;
      if (a.includes('New') && b.includes('Old')) return 1;
      return a.localeCompare(b);
    });

    // Initialize groups based on selected testament
    this.onTestamentChange();
  }

  // Handle Testament change
  onTestamentChange(): void {
    // Get groups for the selected testament
    this.availableGroups = [...new Set(
        Object.values(BIBLE_DATA)
            .filter(book => book.testament === this.selectedTestament)
            .map(book => book.group)
    )].sort();

    // Set default group if current one isn't available
    if (!this.availableGroups.includes(this.selectedGroup)) {
      this.selectedGroup = this.availableGroups[0];
    }

    this.onGroupChange();
  }

  // Handle Group change
  onGroupChange(): void {
    // Get books for the selected group
    this.availableBooks = Object.entries(BIBLE_DATA)
        .filter(([_, book]) => book.testament === this.selectedTestament && book.group === this.selectedGroup)
        .map(([name, _]) => name)
        .sort();

    // Set default book if current one isn't available
    if (!this.availableBooks.includes(this.selectedBook)) {
      this.selectedBook = this.availableBooks[0];
    }

    this.onBookChange();
  }

  // Handle Book change
  onBookChange(): void {
    const bookData = BIBLE_DATA[this.selectedBook];
    if (bookData) {
      // Generate available chapters
      this.availableChapters = Array.from(
          { length: bookData.totalChapters },
          (_, i) => (i + 1).toString()
      );

      // Set default chapter if current one isn't available or is out of range
      const chapterNum = parseInt(this.chapter);
      if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > bookData.totalChapters) {
        this.chapter = '1';
      }

      // Update the example text
      this.updateExampleText();
    }
  }

  // Update the example text based on selected book and chapter
  updateExampleText(): void {
    // This would ideally fetch the actual text from a Bible API
    // For now, we'll just update the header with the selection
    const headerText = `${this.selectedBook} ${this.chapter}`;

    // Only update if the first line looks like a header
    const lines = this.input.split('\n');
    if (lines.length >= 1 && !lines[0].match(/^\d+/)) {
      lines[0] = headerText;
      this.input = lines.join('\n');
    }
  }

  // Function to reduce text (only first letter of each word)
  reduceText(text: string): string {
    const lines = text.split('\n');
    const processedLines: string[] = [];

    const pattern = /[a-zA-Z]+/g;

    for (let i = 0; i < lines.length; i++) {
      const processed = lines[i].replace(pattern, match => match.charAt(0));
      processedLines.push(processed);
    }

    return processedLines.join('\n');
  }

  // Function to parse verses into objects
  parseVerses(text: string): any[] {
    const lines = text.split('\n');
    const verses: any[] = [];
    let currentVerse = '';
    let currentVerseNum = '';
    let headerText = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      const verseMatch = line.match(/^(\d+:\d+|\d+)\s+(.*)$/);

      if (verseMatch) {
        if (currentVerse) {
          verses.push({
            number: currentVerseNum,
            text: currentVerse.trim()
          });
        } else if (headerText && !verses.length) {
          verses.push({
            number: "Header",
            text: headerText.trim()
          });
        }

        currentVerseNum = verseMatch[1];
        currentVerse = verseMatch[2];
      } else if (currentVerseNum) {
        currentVerse += ' ' + line;
      } else {
        if (headerText) headerText += ' ';
        headerText += line;
      }
    }

    if (currentVerse) {
      verses.push({
        number: currentVerseNum,
        text: currentVerse.trim()
      });
    } else if (headerText && !verses.length) {
      verses.push({
        number: "Header",
        text: headerText.trim()
      });
    }

    return verses;
  }

  handleFormat(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.output = this.reduceText(this.input);
      this.verses = this.parseVerses(this.output);
      this.isLoading = false;
      this.isProcessed = true;
    }, 300);
  }

  getVerseChunks(): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < this.verses.length; i += 5) {
      chunks.push(this.verses.slice(i, i + 5));
    }
    return chunks;
  }

  /**
   * Generate and download an Excel file from the verse grid using the uploaded template
   */
  exportToExcel(): void {
    if (!this.isProcessed || this.verses.length === 0) {
      alert('Please generate FLOW text first');
      return;
    }

    this.isLoading = true;

    setTimeout(async () => {
      try {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        const chunks = this.getVerseChunks();

        // For each chunk of verses, create a sheet
        chunks.forEach((chunk, index) => {
          // Create worksheet name
          const worksheetName = `${this.selectedBook} ${this.chapter}${chunks.length > 1 ? ` (${index + 1})` : ''}`;

          // Create headers row (verse numbers)
          const headers = chunk.map(verse => verse.number);
          while (headers.length < 5) {
            headers.push(''); // Fill to 5 columns for consistent formatting
          }

          // Get the maximum number of lines in any verse in this chunk
          let maxLines = 0;
          chunk.forEach(verse => {
            const lineCount = verse.text.split('\n').length;
            if (lineCount > maxLines) maxLines = lineCount;
          });

          // Ensure at least 20 rows for consistency
          maxLines = Math.max(maxLines, 20);

          // Create data array for worksheet
          const wsData = [];

          // Add header row
          wsData.push(headers);

          // Add verse content
          for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
            const row = [];
            for (let verseIndex = 0; verseIndex < 5; verseIndex++) {
              const verse = chunk[verseIndex];
              if (verse) {
                const lines = verse.text.split('\n');
                row.push(lineIndex < lines.length ? lines[lineIndex] : '');
              } else {
                row.push(''); // Empty cell for missing verses
              }
            }
            wsData.push(row);
          }

          // Create worksheet
          const worksheet = XLSX.utils.aoa_to_sheet(wsData);

          // Set column widths to be equal
          const colWidth = 20; // Approximately 20 characters wide
          worksheet['!cols'] = Array(5).fill({ width: colWidth });

          // Set row heights (slightly taller for header row)
          worksheet['!rows'] = [
            { hpt: 30 }, // Header row taller
            ...Array(maxLines).fill({ hpt: 24 }) // Content rows
          ];

          // Add styling to header row (bold, background color, borders)
          for (let i = 0; i < 5; i++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
            if (!worksheet[cellRef]) {
              worksheet[cellRef] = { t: 's', v: '' };
            }

            worksheet[cellRef].s = {
              fill: { fgColor: { rgb: "ECF4FF" } }, // Light blue background
              font: { bold: true },
              border: {
                bottom: { style: 'thin', color: { rgb: "4472C4" } } // Blue bottom border
              },
              alignment: { horizontal: 'center', vertical: 'center' }
            };
          }

          // Add styling to the content cells
          for (let row = 1; row <= maxLines; row++) {
            for (let col = 0; col < 5; col++) {
              const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
              if (!worksheet[cellRef]) {
                worksheet[cellRef] = { t: 's', v: '' };
              }

              // Special styling for every 5th column (blue background)
              const isSpecialColumn = col === 4;

              worksheet[cellRef].s = {
                font: { name: 'Calibri', sz: 11 },
                alignment: { vertical: 'top', wrapText: true },
                fill: isSpecialColumn ?
                    { fgColor: { rgb: "ECF4FF" } } : // Light blue for 5th column
                    { fgColor: { rgb: "FFFFFF" } }   // White for other columns
              };
            }
          }

          // Add the worksheet to the workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
        });

        // Generate filename based on book and chapter
        const filename = `${this.selectedBook}_${this.chapter}_FLOW.xlsx`;

        // Write and download the file
        XLSX.writeFile(workbook, filename);

        this.isLoading = false;
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Failed to export to Excel. Please try again.');
        this.isLoading = false;
      }
    }, 300);
  }
}
