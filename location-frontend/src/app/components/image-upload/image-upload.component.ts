import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  @Input() currentImageUrl?: string;
  @Input() placeholder: string = 'Télécharger une image';
  @Input() accept: string = 'image/*';
  @Input() maxSizeMB: number = 5;
  @Input() disabled: boolean = false;
  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: any;

  isDragging = false;
  previewUrl?: string;
  errorMessage?: string;

  get hasImage(): boolean {
    return !!(this.currentImageUrl || this.previewUrl);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage = undefined;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Veuillez sélectionner un fichier image valide.';
      return;
    }

    // Validate file size
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.errorMessage = `La taille du fichier ne doit pas dépasser ${this.maxSizeMB}MB.`;
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.imageSelected.emit(file);
  }

  removeImage(): void {
    this.previewUrl = undefined;
    this.errorMessage = undefined;
    this.imageRemoved.emit();
    
    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  get displayImage(): string | undefined {
    return this.previewUrl || this.currentImageUrl;
  }
}
