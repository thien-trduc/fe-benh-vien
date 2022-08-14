import { TamUng } from './../../tam-ung.model';
import { USER_NHANVIEN, TAM_UNG_DETAIL_ROUTE } from './../../../helper/constant';
import { TamUngService } from './../../tam-ung.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { TAM_UNG_ROUTE } from 'src/app/helper/constant';
import { BenhAnService } from 'src/app/benh-an/benh-an.service';
import { BenhAn } from 'src/app/benh-an/model/benh-an.model';
import { HoaDonService } from 'src/app/hoa-don/hoa-don.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'tạm ứng';
  validateForm: FormGroup;
  maNV = USER_NHANVIEN;
  listRoute = `/${TAM_UNG_ROUTE}`;
  data: TamUng;
  benhAn: BenhAn;
  modal: NzModalRef;
  soTien: string;
  isXuatHoaDon = false;
  selectedMucTamUng = 1;

  constructor(
    private fb: FormBuilder,
    private service: TamUngService,
    private benhAnService: BenhAnService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService,
    private hoaDonService: HoaDonService,
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
      const maBA = this.route.snapshot.queryParams.maBA;
      console.log(maBA)
      let formData = { ...this.validateForm.value };
      let res :any;
      if (this.data) {
        res = await this.service.update(this.data.maPTU, formData);
      } else {
        formData = { ...formData, maNV: this.maNV, maBA };
        res = await this.service.store(formData);
        this.data = null;
      }
      this.modal = this.modalService.success({
        nzTitle: 'Tạm ứng',
        nzContent: `Lưu phiếu thành công`,
      });
      this.router.navigateByUrl(`${TAM_UNG_ROUTE}/${TAM_UNG_DETAIL_ROUTE}/${res.maPTU}?maBA=${maBA}`);

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
      maPTU: [null, [Validators.minLength(8), Validators.maxLength(25)]],
      ngayLap: [null, [Validators.required]],
      soTien: [null, [Validators.required, Validators.pattern('^[0-9]+')]],
      lyDo: [null, [Validators.required, Validators.maxLength(500)]],
      ghiChu: [null, [Validators.maxLength(500)]],
    });
    const maBA = this.route.snapshot.queryParams.maBA;
    if (maBA) {
      this.benhAn = await this.benhAnService.getById(maBA);
    }
    const maPTU = this.route.snapshot.paramMap.get('id');
    if (maPTU) {
      this.data = await this.service.getById(maPTU);
      const { createdAt, updatedAt, deletedAt, nhanVien, benhAn , ...data } = this.data;
      this.validateForm.setValue({ ...data });
      this.soTien = data.soTien;
      const resHoaDon = await this.hoaDonService.fetch(1, 1, null, null, { benhAn: { maBA } });
      if (resHoaDon.rows && resHoaDon.rows.length > 0) {
        this.isXuatHoaDon = true;
      }
    }
  }

  disabledDate(current): any {
    const date = new Date();
    return current && current >= date;
  }

  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }

  selectMucTamUng(giaTri: number): void {
    const maBA = this.route.snapshot.queryParams.maBA;
    this.service.tinhPhanTramTamUng(maBA, giaTri)
          .then(data => {
            this.soTien = data.toString();
          })
          .catch(err => console.log(err));
  }

}
