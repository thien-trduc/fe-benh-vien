import { THUOC_ROUTE } from './../../../helper/constant';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { ThuocService } from '../../thuoc.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Thuốc';
  validateForm: FormGroup;
  listRoute = `/${THUOC_ROUTE}`;
  hinhAnh: any;

  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${THUOC_ROUTE}`;

  constructor(
    private fb: FormBuilder,
    private service: ThuocService,
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
      this.router.navigate([THUOC_ROUTE]);
    } catch ({ error }) {
      this.message.error(`Tạo thất bại : ${error.message}`);
    }
  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.hinhAnh = event.target.files[0];
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      tenThuoc: [null, [Validators.required, Validators.maxLength(50)]],
      congDung: [null, [Validators.required, Validators.maxLength(100)]],
      moTa: [null, [Validators.maxLength(255)]],
      gia: [null, [Validators.required, Validators.pattern('^[0-9]+')]],
      ghiChu: [null, [Validators.maxLength(255)]],
      hinhAnh: [null, [Validators.maxLength(255)]],
    });
  }

  customReq = async (item: UploadXHRArgs) => {
    const res = await this.service.uploadV2(item.file);
    this.validateForm.controls.hinhAnh.setValue(res.url);
    this.files = [{url : res.url}];
    return res;
  }
}
