import { NhanVienService } from './../../../nhan-vien/nhan-vien.service';
import { BenhNhanService } from './../../../benh-nhan/benh-nhan.service';
import { BenhNhan } from './../../../benh-nhan/benh-nhan.model';
import { NhanVien } from './../../../nhan-vien/model/nhan-vien.model';
import { BenhAnService } from './../../benh-an.service';
import { BENH_AN_ROUTE, BENH_AN_DETAIL_ROUTE, USER_NHANVIEN } from './../../../helper/constant';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Bệnh Án';
  validateForm: FormGroup;
  listRoute = `/${BENH_AN_ROUTE}`;
  editRoute = `/${BENH_AN_DETAIL_ROUTE}`;
  maNV = USER_NHANVIEN;
  benhNhan: BenhNhan;
  bacSi: NhanVien;
  yTa: NhanVien;
  modal: NzModalRef;

  current = 0;

  index = 'First-content';

  constructor(
    private fb: FormBuilder,
    private service: BenhAnService,
    private benhNhanService: BenhNhanService,
    private nhanVienService: NhanVienService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) { }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      return;
    }
    const { chanDoan, tinhTrang, ...data } = this.validateForm.value;
    this.validateForm.setValue({
      ...data,
      chanDoan: chanDoan ? chanDoan.trim() : '',
      tinhTrang: tinhTrang ? tinhTrang.trim() : '',
    });
    console.log(this.validateForm.value);
    try {
      const formData = { ...this.validateForm.value, maNV: this.maNV };
      const newBA = await this.service.store(formData);
      sessionStorage.setItem('bacSi', formData.maBacSi)
      this.router.navigate([`${this.listRoute}${this.editRoute}/${newBA.maBA}`]);
      this.modal = this.modalService.success({
        nzTitle: 'Bệnh án',
        nzContent: `Lưu thành công !`,
      });
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: error,
      });
    }
  }

  async onGetBenhNhan(cmnd: string): Promise<void> {
    this.benhNhan = await this.benhNhanService.getById(cmnd);
    this.validateForm.controls.cmnd.setValue(this.benhNhan.cmnd);
    this.modal = this.modalService.info({
      nzTitle: 'Bệnh nhân',
      nzContent: `Chọn bệnh nhân: ${this.benhNhan.hoTen}. Thành công !`,
      nzMaskClosable: true
    });
  }

  async onGetBacSi(maNV: string): Promise<void> {
    this.bacSi = await this.nhanVienService.getById(maNV);
    this.validateForm.controls.maBacSi.setValue(this.bacSi.maNV);
    this.modal = this.modalService.info({
      nzTitle: 'Bác Sĩ Khám',
      nzContent: `Chọn bác sĩ: ${this.bacSi.hoTen}. Thành công !`,
      nzMaskClosable: true
    });
  }

  async onGetYta(maNV: string): Promise<void> {
    this.yTa = await this.nhanVienService.getById(maNV);
    this.validateForm.controls.maYta.setValue(this.yTa.maNV);
    this.modal = this.modalService.info({
      nzTitle: 'Y Tá',
      nzContent: `Chọn y tá: ${this.yTa.hoTen}. Thành công `,
      nzMaskClosable: true
    });
  }

  ngOnInit(): void {
    this.maNV = JSON.parse(localStorage.getItem('currentUser')).maNV;
    this.validateForm = this.fb.group({
      cmnd: [null, [Validators.required]],
      chieuCao: [null, [Validators.pattern('^-?[0-9]*(\.[0-9]+)?')]],
      canNang: [null, [Validators.pattern('^-?[0-9]*(\.[0-9]+)?')]],
      tienSu: [null, [Validators.maxLength(255)]],
      maBacSi: [null, [Validators.required]],
      maYta: [null],
      chanDoan: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      tinhTrang: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      ngayKham: [null, [Validators.required]],
    });
  }

  disabledDate(current): any {
    const date = new Date();
    return current && current >= date;
  }

  pre(): void {
    this.current -= 1;
    if (this.current < 0) {
      this.router.navigate([`${this.listRoute}`]);
    }
  }

  next(): void {
    this.current += 1;
  }

  done(): void {
    console.log('done');
  }
}
