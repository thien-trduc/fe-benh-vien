import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { getServerErrorMessage } from 'src/app/helper/handling-error';

import { KHOA_ROUTE } from '../../helper/constant';
import { KhoaService } from './../khoa.service';


@Component({
  selector: 'app-khoa-form',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Khoa';
  validateForm: FormGroup;
  listRoute = `/${KHOA_ROUTE}`;

  constructor(
    private fb: FormBuilder,
    private service: KhoaService,
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
      this.router.navigate([KHOA_ROUTE]);
      this.message.info(`Lưu thành công`);
    } catch ({error}) {
      this.message.error(`Lưu Thất bại ${error.message}`);
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      maKhoa: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^KH-[0-9]+')]],
      tenKhoa: [null, [Validators.required, Validators.maxLength(50)]],
      email: [null, [Validators.email, Validators.maxLength(100)]],
      soDienThoai: [
        null,
        [Validators.maxLength(20), Validators.pattern(`(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})`)]
      ],
    });
  }
}
