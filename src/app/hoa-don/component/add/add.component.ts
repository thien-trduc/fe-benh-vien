import { HoaDon } from '../../hoa-don.model';
import { USER_NHANVIEN, HOA_DON_DETAIL_ROUTE } from './../../../helper/constant';
import { HoaDonService } from '../../hoa-don.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HOA_DON_ROUTE } from 'src/app/helper/constant';
import { BenhAn } from 'src/app/benh-an/model/benh-an.model';
import { BenhAnService } from 'src/app/benh-an/benh-an.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Hóa Đơn';
  validateForm: FormGroup;
  maNV = USER_NHANVIEN;
  listRoute = `/${HOA_DON_ROUTE}`;
  data: HoaDon;
  benhAn: BenhAn;
  modal: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private service: HoaDonService,
    private benhAnService: BenhAnService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService
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
    try {
      const maBA = this.route.snapshot.queryParams.maBA;
      let formData = { ...this.validateForm.value };
      let res: any;
      if (this.data) {
        res = await this.service.update(this.data.maHD, formData);
      } else {
        formData = { ...formData, maNV: this.maNV, maBA };
        res = await this.service.store(formData);
      }
      this.modal = this.modalService.success({
        nzTitle: 'Hóa Đơn',
        nzContent: `Lập hóa đơn thành công`,
      });
      this.router.navigateByUrl(`${HOA_DON_ROUTE}/${HOA_DON_DETAIL_ROUTE}/${res.maHD}?maBA=${maBA}`);
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
      maHD: [null, [Validators.minLength(8), Validators.maxLength(25)]],
      ngayLap: [null, [Validators.required]],
      ghiChu: [null, [Validators.maxLength(500)]],
    });
    const maBA = this.route.snapshot.queryParams.maBA;
    if(maBA) {
      this.benhAn = await this.benhAnService.getById(maBA);
    }
    const maHD = this.route.snapshot.paramMap.get('id');
    if (maHD) {
      this.data = await this.service.getById(maHD);
      const { createdAt, updatedAt, deletedAt, ...data } = this.data;
      this.validateForm.setValue({ ...data });
    }
  }


  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }


  formatCurrent(money): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });

  }

  disabledDate(current): any {
    const date = new Date();
    return current && current >= date;
  }
}
