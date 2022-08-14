import { XuatVien } from '../../xuat-vien.model';
import { USER_NHANVIEN, XUAT_VIEN_DETAIL_ROUTE } from './../../../helper/constant';
import { XuatVienService } from '../../xuat-vien.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { XUAT_VIEN_ROUTE } from 'src/app/helper/constant';
import { BenhAn } from 'src/app/benh-an/model/benh-an.model';
import { BenhAnService } from 'src/app/benh-an/benh-an.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Xuất Viện';
  validateForm: FormGroup;
  maNV = USER_NHANVIEN;
  listRoute = `/${XUAT_VIEN_ROUTE}`;
  data: XuatVien;
  benhAn: BenhAn;
  modal: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private service: XuatVienService,
    private benhAnService: BenhAnService,
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
    const { lyDo, ...data } = this.validateForm.value;
    this.validateForm.setValue({
      ...data,
      lyDo: lyDo ? lyDo.trim() : '',
    });
    if (this.validateForm.invalid) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      return;
    }
    try {
      let res: any;
      const maBA = this.route.snapshot.queryParams.maBA;
      let formData = { ...this.validateForm.value };
      if (this.data) {
        formData = { ...formData, maNV: this.data.nhanVien.maNV, maBA: this.data.benhAn.maBA };
        res = await this.service.update(this.data.maPXV, formData);
      } else {
        formData = { ...formData, maNV: this.maNV, maBA };
        res = await this.service.store(formData);
      }
      this.modal = this.modalService.success({
        nzTitle: 'Xuất viện',
        nzContent: `Lưu phiếu thành công`,
      });
      this.router.navigateByUrl(`${XUAT_VIEN_ROUTE}/${XUAT_VIEN_DETAIL_ROUTE}/${res.maPXV}?maBA=${maBA}`);
      this.data = null;
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: error,
      });
    }
  }

  async ngOnInit(): Promise<void> {
    this.maNV = JSON.parse(localStorage.getItem('currentUser')).maNV;
    this.validateForm = this.fb.group({
      ngayLap: [null, [Validators.required]],
      lyDo: [null, [Validators.required, Validators.maxLength(500)]],
      ghiChu: [null, [Validators.maxLength(500)]],
    });
    const maBA = this.route.snapshot.queryParams.maBA;
    if (maBA) {
      this.benhAn = await this.benhAnService.getById(maBA);
    }
    const maPXV = this.route.snapshot.paramMap.get('id');
    if (maPXV) {
      this.data = await this.service.getById(maPXV);
      this.validateForm.setValue({ ...this.data });
    }
  }

  disabledDate(current): any {
    return current && current.valueOf() <= Date.now();
  }
}
