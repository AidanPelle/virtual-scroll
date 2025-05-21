import { TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { ResizableDirective } from './resizable.directive';
import { firstValueFrom, take, tap } from 'rxjs';

describe('ResizableDirective', () => {
  let directive: ResizableDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResizableTest, ResizableDirective],
    })
      .compileComponents();

    const fixture = TestBed.createComponent(ResizableTest);
    fixture.detectChanges();

    directive = fixture.componentInstance.resizableDirective;
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should track mouse movements', (done) => {
    const initialX = 5;
    const movedX = 15;
    const delta = movedX - initialX;
    directive.onMouseDown({ clientX: initialX, preventDefault: () => { } } as MouseEvent);

    const mockMouseMove = new MouseEvent('mousemove', { clientX: movedX });

    directive.resize.pipe(
      take(1),
      tap(generatedDelta => {
        expect(delta).toEqual(generatedDelta);
        done();
      })
    ).subscribe();

    document.dispatchEvent(mockMouseMove);
  });

  it('should track touch movements', (done) => {
    const initialX = 5;
    const movedX = 15;
    const delta = movedX - initialX;

    const mockTouchStart = {
      type: 'touchstart',
      touches: [{
        clientX: initialX,
      }],
      preventDefault: () => { },
    } as unknown as TouchEvent;
    directive.onTouchStart(mockTouchStart);
    
    const mockTouchMove = new CustomEvent<TouchEvent>('touchmove');
    Object.defineProperty(mockTouchMove, 'touches', {
      value: [{ clientX: movedX }]
    });

    directive.resize.pipe(
      take(1),
      tap(generatedDelta => {
        expect(delta).toEqual(generatedDelta);
        done();
      })
    ).subscribe();

    document.dispatchEvent(mockTouchMove);
  });
});
@Component({
  template: `
    <div vsResizable></div>
  `,
})
class ResizableTest {
  @ViewChild(ResizableDirective, { static: true }) resizableDirective!: ResizableDirective;
}