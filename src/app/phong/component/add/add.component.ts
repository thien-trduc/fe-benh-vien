import { KhoaService } from './../../../khoa/khoa.service';
import { PhongService } from './../../phong.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PHONG_ROUTE } from 'src/app/helper/constant';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Khoa } from 'src/app/khoa/khoa.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Phòng';
  validateForm: FormGroup;
  listRoute = `/${PHONG_ROUTE}`;
  khoas: Khoa[];

  constructor(
    private fb: FormBuilder,
    private service: PhongService,
    private khoaService: KhoaService,
    private router: Router,
    private message: NzMessageService) { }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      this.message.info(`Xin hãy điền đẩy đủ thông tin`);
      return;
    }
    try {
      await this.service.store(this.validateForm.value);
      this.message.info(`Tạo thành công`);
      this.router.navigate([PHONG_ROUTE]);
    } catch ({ error }) {
      this.message.error(`Tạo thất bại : ${error.message}`);
    }
  }

  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      soPhong: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+')]],
      maKhoa: [null, [Validators.required]],
      gia: [null, [Validators.required, Validators.pattern('^[0-9]+')]],
      ghiChu: [null, [Validators.maxLength(255)]],
    });
    try {
      this.khoas = (await this.khoaService.fetch(1, 10000, null, null)).rows;

    } catch ({ error }) {
      throw error;

    }
  }

}
