import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchText: string = '';

  @Output() public inputChanged: EventEmitter<string> =
    new EventEmitter<string>();

  onInputChanged() {
    this.inputChanged.emit(this.searchText);
    console.log(this.searchText);
  }
}
