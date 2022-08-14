import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { KHOA_ROUTE } from 'src/app/helper/constant';
import { getServerErrorMessage } from 'src/app/helper/handling-error';
import { Khoa } from '../khoa.model';
import { KhoaService } from '../khoa.service';

@Component({
  selector: 'app-khoa-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  title = 'Khoa';
  khoa: Khoa;
  validateForm: FormGroup;
  listRoute = `/${KHOA_ROUTE}`;

  constructor(
    private fb: FormBuilder,
    private service: KhoaService,
    private router: Router,
    private route: ActivatedRoute,
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
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.update(id, this.validateForm.value);
      this.router.navigate([KHOA_ROUTE]);
      this.message.info(`Lưu thành công`);
    }catch ({error}) {
      this.message.error(`Lưu Thất bại ${error.message}`);
    }
  }

  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      maKhoa: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^KH-[0-9]+')]],
      tenKhoa: [null, [Validators.required, Validators.maxLength(50)]],
      email: [null, [Validators.email, Validators.maxLength(100)]],
      soDienThoai: [
        null,
        [Validators.required, Validators.maxLength(20), Validators.pattern(`(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})`)]
      ],
    });
    const id = this.route.snapshot.paramMap.get('id');
    try {
      this.khoa = await this.service.getById(id);
      const { createdAt, updatedAt, deletedAt, ...data } = this.khoa;
      this.validateForm.setValue({ ...data });
    } catch (error) {
      this.message.error(getServerErrorMessage(error));
    }
  }
}
