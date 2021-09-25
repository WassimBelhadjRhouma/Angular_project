import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): any {
    if (
      (e.key?.toLowerCase() === 'c' && e.ctrlKey === true) || // Ctrl+C
      (e.key?.toLowerCase() === 'x' && e.ctrlKey === true) || // Ctrl+X
      (e.key?.toLowerCase() === 'c' && e.metaKey === true) || // Cmd+C (Mac)
      (e.key?.toLowerCase() === 'x' && e.metaKey === true) ||  // Cmd+X (Mac)

      (e.key?.toLowerCase() === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key?.toLowerCase() === 'v' && e.metaKey === true)// Allow: Cmd+V (Mac)

    ) {
      e.preventDefault();
    }
  }


  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('Drop', ['$event']) blockDrop(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('drag', ['$event']) blockDrag(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  constructor() { }

}
