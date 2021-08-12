import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {
  @Output() searchValues = new EventEmitter<FormGroup>();
  @Output() toogleForm = new EventEmitter<boolean>();
  @Input() keyword: string;
  form: FormGroup;
  search: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.fb.group({
      q: [this.keyword],
      sort: [''],
      itempricemin: [''],
      itempricemax: [''],
      has_pic: [false]
    });
  }

  submit() {
    this.searchValues.emit(this.form);
  }

  reset() {
    this.form.reset();
    setTimeout(() => this.toogleForm.emit(false), 100);
  }
}
