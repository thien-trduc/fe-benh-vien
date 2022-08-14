import { Kham } from 'src/app/benh-an/model/benh-an.kham.model';
import { ThuocService } from './../../../thuoc/thuoc.service';
import { Thuoc } from './../../../thuoc/model/thuoc.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';

import { TOA_THUOC_DETAIL_ROUTE, TOA_THUOC_ROUTE } from './../../../helper/constant';
import { ToaThuocService } from './../../toa-thuoc.service';
import { BenhAnService } from 'src/app/benh-an/benh-an.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Toa Thuốc';
  validateForm: FormGroup;
  validateFormChonThuoc: FormGroup;
  listRoute = `/${TOA_THUOC_ROUTE}`;
  modalAddThuoc = false;
  thuocSelecteds: Thuoc;
  khamSelected: number;
  chiTietToas: any[] = [];
  modalChiTiets = false;
  modalKhams = false;
  idChiTietKham: string;
  kham: Kham;
  modal: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private service: ToaThuocService,
    private thuocService: ThuocService,
    private khamService: BenhAnService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) { }

  submitChonThuoc() {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormChonThuoc.controls) {
      this.validateFormChonThuoc.controls[i].markAsDirty();
      this.validateFormChonThuoc.controls[i].updateValueAndValidity();
    }
    if (this.validateFormChonThuoc.invalid) {
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      return;
    }
    const thuocChon = this.validateFormChonThuoc.value;
    if (this.chiTietToas.length > 0) {
      const exist = this.chiTietToas.findIndex(item => item.maThuoc === thuocChon.maThuoc)
      if (exist > -1) {
        const { maThuoc, soLuong, donGia, cachDung } = this.chiTietToas[exist];
        const newThuocChon = {
          maThuoc,
          soLuong: (parseInt(soLuong) + parseInt(thuocChon.soLuong)).toString(),
          donGia,
          cachDung,
        }
        this.chiTietToas = this.chiTietToas.filter(item => item.maThuoc !== thuocChon.maThuoc)
        this.chiTietToas = [...this.chiTietToas, newThuocChon];
      } else {
        this.chiTietToas = [...this.chiTietToas, thuocChon];
      }
    } else {
      this.chiTietToas = [...this.chiTietToas, thuocChon];
    }
    this.modalChiTiets = false;
  }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const { thucHienYLenh, ...data } = this.validateForm.value;
    this.validateForm.setValue({
      ...data,
      thucHienYLenh: thucHienYLenh ? thucHienYLenh.trim() : '',
    });
    if (this.validateForm.invalid) {
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      // this.message.error(`Xin hãy điền đẩy đủ thông tin`);
      return;
    }
    if (this.chiTietToas && this.chiTietToas.length <= 0) {
      // this.message.error(`Xin chọn thuốc`);
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: `Xin chọn thuốc`,
      });
      return;
    }
    try {
      const formData = this.validateForm.value;
      const res = await this.service.store({ ...formData, chiTietThuocs: this.chiTietToas });
      this.modal = this.modalService.success({
        nzTitle: 'Thành Công',
        nzContent: `Lập toa thuốc thành công`,
      });
      this.router.navigateByUrl(`${TOA_THUOC_ROUTE}/${TOA_THUOC_DETAIL_ROUTE}/${res.maToa}`);
    } catch (error) {
      // this.message.error(`Tạo thất bại : ${error.message}`);
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: error,
      });
    }
  }

  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      thucHienYLenh: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      idCtKham: [null, [Validators.required]]
    });

    this.validateFormChonThuoc = this.fb.group({
      maThuoc: [null, [Validators.required, Validators.maxLength(25)]],
      soLuong: [null, [Validators.required, Validators.pattern('^-?[0-9]*(\.[0-9]+)?')]],
      cachDung: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      donGia: [null, [Validators.required]]
    });
    const maKham = this.route.snapshot.queryParams.makham;
    console.log(maKham)
    if (maKham) {
      this.khamSelected = parseInt(maKham);
      this.kham = await this.khamService.getKhamById(maKham.toString());
      this.validateForm.controls.idCtKham.setValue(maKham);
    }

  }

  showChiTietModal(): void {
    this.modalChiTiets = true;
    this.validateFormChonThuoc.reset();

  }

  cancelModalChiTiet(): void {
    this.modalChiTiets = false;
    this.validateFormChonThuoc.reset();
  }

  showModalAddThuoc() {
    this.thuocSelecteds = null;
    this.modalAddThuoc = true;
  }

  cancelModalAddThuoc() {
    this.thuocSelecteds = null;
    this.modalAddThuoc = false;
  }

  async onGetThuoc(maThuoc: string): Promise<void> {
    try {
      this.thuocSelecteds = await this.thuocService.getById(maThuoc);
      this.validateFormChonThuoc.controls.maThuoc.setValue(this.thuocSelecteds.maThuoc);
      this.validateFormChonThuoc.controls.donGia.setValue(this.thuocSelecteds.gia);
      this.modalAddThuoc = false;
      // this.message.info(`Chọn thuốc : ${this.thuocSelecteds.tenThuoc} . Thành công !`);
      this.modal = this.modalService.info({
        nzTitle: 'Thông tin',
        nzContent: `Chọn thuốc : ${this.thuocSelecteds.tenThuoc} . Thành công !`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  showModalKham() {
    this.modalKhams = true;
  }

  cancelModalKham() {
    this.modalKhams = false;
  }

  async onGetKham(maKham: number): Promise<void> {
    try {
      this.validateForm.controls.idCtKham.setValue(maKham);
      this.modalKhams = false;
      this.khamSelected = maKham;
      this.kham = await this.khamService.getKhamById(maKham.toString());
      // this.message.info(`Chọn thuốc mã khám: ${maKham} . Thành công !`);
      this.modal = this.modalService.info({
        nzTitle: 'Thông tin',
        nzContent: `Chọn mã khám: ${maKham} . Thành công !`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteChiTietThuoc(maThuoc: string): void {
    this.chiTietToas = this.chiTietToas.filter(item => item.maThuoc !== maThuoc);
  }


  formatCurrency(money: number): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money ? money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : '0';
  }

  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getUTCFullYear()}/${(m.getUTCMonth() + 1)}/${m.getUTCDate()},  ${m.getUTCHours()}:${m.getUTCMinutes()}:${m.getUTCSeconds()}
    `;
  }

  // async getTenThuoc(maThuoc: string): Promise<string> {
  //   try {
  //     const res = await this.thuocService.getById(maThuoc);
  //     return res.tenThuoc;
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}
