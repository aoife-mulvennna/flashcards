import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckListComponent } from './deck-list';

describe('DeckList', () => {
  let component: DeckListComponent;
  let fixture: ComponentFixture<DeckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
