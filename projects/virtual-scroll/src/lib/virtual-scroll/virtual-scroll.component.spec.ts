import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollComponent } from './virtual-scroll.component';
import { VirtualScrollModule } from '../virtual-scroll.module';
import { By } from '@angular/platform-browser';
import { CustomDataSource } from '../data-sources/custom-data-source';
import { firstValueFrom } from 'rxjs';

describe('VirtualScrollComponent', () => {
  let component: VirtualScrollComponent<number>;
  let fixture: ComponentFixture<VirtualScrollComponent<number>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollModule],
      // Don't need to declare virtualScrollComponent since it's exported in VirtualScrollModule
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualScrollComponent<number>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be loading by default', () => {
    const divs = fixture.debugElement.queryAll(By.css('div'));
    const loadingDiv = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes("Loading"));
    expect(loadingDiv).toBeTruthy();
  });

  it('should be loading when provided a dataSource plus manual flag', () => {
    component.dataSource = new CustomDataSource([5]);
    component.loading = true;
    fixture.detectChanges();
    
    const divs = fixture.debugElement.queryAll(By.css('div'));
    const loadingDiv = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes("Loading"));
    expect(loadingDiv).toBeTruthy();
  });

  it('should not be loading', () => {
    component.dataSource = new CustomDataSource([5]);
    fixture.detectChanges();
    
    const divs = fixture.debugElement.queryAll(By.css('div'));
    const loadingDiv = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes("Loading"));
    expect(loadingDiv).toBeFalsy();
  });

  it('should not have a vertical scrollbar', async () => {
    component.dataSource = new CustomDataSource([5]);
    fixture.detectChanges();
    
    const hasVerticalScrollBar = await firstValueFrom(component.hasVerticalScrollBar$);
    expect(hasVerticalScrollBar).toBeFalsy();
  });

  it('should have a vertical scrollbar', async () => {
    component.dataSource = new CustomDataSource(Array(100).fill(0));
    fixture.detectChanges();
    
    const hasVerticalScrollBar = await firstValueFrom(component.hasVerticalScrollBar$);
    expect(hasVerticalScrollBar).toBeTruthy();
  });
});
