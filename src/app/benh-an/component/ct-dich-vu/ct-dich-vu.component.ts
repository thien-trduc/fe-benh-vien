import { NhanVienService } from 'src/app/nhan-vien/nhan-vien.service';
import { USER_NHANVIEN } from './../../../helper/constant';
import { NhanVien } from './../../../nhan-vien/model/nhan-vien.model';
import { DichVuService } from './../../../dich-vu/dich-vu.service';
import { DichVu } from './../../../dich-vu/model/dich-vu.model';
import { ChiTietDichVu } from './../../model/benh-an.dich-vu.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BenhAnService } from '../../benh-an.service';
import { NzMessageService, UploadFile, NzModalRef, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BenhAnDichVuHinhAnh } from '../../model/benh-an-ctdv-hinh-anh.model';

@Component({
  selector: 'app-ct-dich-vu',
  templateUrl: './ct-dich-vu.component.html',
  styleUrls: ['./ct-dich-vu.component.css']
})
export class CtDichVuComponent implements OnInit {
  @Input() isXuatHoaDon: boolean;
  @Input() maNV: string;

  title = `Sử dụng dịch vụ`;
  data: ChiTietDichVu;
  dataDichVu: DichVu;
  dataBacSi: NhanVien;
  dataBacSiThucHien: NhanVien;
  datas: ChiTietDichVu[] = [];
  searchResult: ChiTietDichVu[] = [];
  pageSize = 3;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = false;
  modalCtDichVu = false;
  modalBacSi = false;
  modalBacSiThucHien = false;
  modalDichVu = false;
  tuNgay: Date;
  denNgay: Date;
  validateForm: FormGroup;
  startValue: Date | null = null;
  endValue: Date | null = null;
  endOpen = false;
  dichVus: DichVu[];
  hinhAnh: string;
  hinhAnhUrl: string;
  loadingHinhAnh = false;
  modal: NzModalRef;
  tempMaNV: string;

  hinhAnhs: BenhAnDichVuHinhAnh[] = [];
  apiUpload = `${environment.apiUrl}/upload/dich-vu-su-dung`;
  files: any[] = [];

  modalChiTietHinhAnh = false;
  hinhAnhChiTiet: string;


  constructor(
    private service: BenhAnService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private dichVuService: DichVuService,
    private nhanVienService: NhanVienService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
  ) { }

  async ngOnInit() {
    this.validateForm = this.fb.group({
      maDV: [null, [Validators.required]],
      donGia: [null, [Validators.required]],
      maBacSi: [null, [Validators.required]],
      maNV: [null, [Validators.required]],
      ketQua: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      hinhAnhs: [null]
    });
    this.refesh();
  }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.value)
    if (this.validateForm.invalid) {
      // this.message.info(`Xin hãy điền đẩy đủ thông tin`);
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      return;
    }
    try {
      const id = this.route.snapshot.paramMap.get('id');
      this.validateForm.controls.hinhAnhs.setValue(this.getUrlInfiles());
      if (this.data) {
        const formData = { ...this.validateForm.value };
        await this.service.updateChiTietDichVuSuDung(
          this.data.id,
          formData
        );
      } else {
        const formData = { ...this.validateForm.value };
        await this.service.createChiTietDichVuSuDung(id, formData);
      }
      this.message.info(`Lưu thành công`);
      this.onLamMoi();
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: error,
      });
      // this.message.error(`Lưu thất bại ${error.message}`);
    }
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.refesh();
  }

  async refesh(query: any = {}): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    const {
      pageIndex,
      pageSize,
      total,
      rows
    } = await this.service.getDichVuSuDung(id, this.pageIndex, this.pageSize, this.sortKey, this.sortValue, query);
    this.datas = rows;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
    this.loading = false;
  }

  async onPageChange(reset: boolean = false): Promise<void> {
    if (reset) {
      this.pageIndex = 1;
    }
    this.refesh();
  }

  async onSearch(): Promise<void> {
    if (this.tuNgay && this.denNgay) {
      try {
        console.log(this.tuNgay, this.denNgay)
        const id = this.route.snapshot.paramMap.get('id');
        this.loading = true;
        const {
          pageIndex,
          pageSize,
          total,
          rows
        } = await this.service.searchDichVuSuDung(id, this.pageIndex, this.pageSize, { tuNgay: this.tuNgay, denNgay: this.denNgay });
        this.datas = rows;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;
      } catch (error) {
        console.log(error)
      }
    }
  }

  async delete(maDV: string, ngay: Date): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      const date = new Date(ngay);
      // await this.service.deleteDichVuSuDung(id, maDV, date.toLocaleString());
      this.refesh();
      this.modal = this.modalService.success({
        nzTitle: 'Dịch Vụ',
        nzContent: 'Xóa Thành Công',
      });
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: 'Lỗi Không thể Xóa',
      });
    }
  }

  onLamMoi(): void {
    this.data = null;
    this.dataBacSi = null;
    this.dataDichVu = null;
    this.modalCtDichVu = false;
    this.validateForm.reset();
    this.tuNgay = null;
    this.denNgay = null;
    this.pageSize = 3,
    this.pageIndex = 1,
    this.total = 1,
    this.sortValue = null,
    this.sortKey = null,
    this.hinhAnhs = [];
    this.files = [];
    this.refesh();
  }

  async openModelChiTiet(id: string): Promise<void> {
    this.modalCtDichVu = true;
    this.validateForm.reset();
    if (id) {
      // this.tempMaNV = this.maNV || null;
      this.data = await this.service.getDichVuSuDungById(id);
      console.log(this.data)
      const { id: i, dichVu,
        bacSi, nhanVien, benhAnDichVuHinhAnhs, ngay: n, ...data } = this.data;
      // this.maNV = nhanVien.maNV;
      this.dataBacSi = bacSi;
      this.dataBacSiThucHien = nhanVien;
      this.dataDichVu = dichVu;
      this.validateForm.setValue({
        ...data,
        hinhAnhs: null,
        maBacSi: bacSi.maNV,
        maDV: dichVu.maDV,
        maNV: nhanVien.maNV
      });
      this.hinhAnhs = benhAnDichVuHinhAnhs;
    }
  }

  async onCancelModelCtDichVu(): Promise<void> {
    // if (this.data) {
    //   this.maNV = this.tempMaNV || null;
    // }
    this.data = null;
    this.dataBacSi = null;
    this.dataDichVu = null;
    this.dataBacSiThucHien = null;
    this.modalCtDichVu = false;
    this.validateForm.reset();
    this.hinhAnhs = [];
    this.files = [];
  }

  async onGetBacSi(maNV: string): Promise<void> {
    try {
      this.dataBacSi = await this.nhanVienService.getById(maNV);
      this.validateForm.controls.maBacSi.setValue(this.dataBacSi.maNV);
      this.modalBacSi = false;
      // this.message.info(`Chọn bác sĩ: ${this.dataBacSi.hoTen} . Thành công !`);
      this.modal = this.modalService.info({
        nzTitle: 'Thông tin',
        nzContent: `Chọn bác sĩ: ${this.dataBacSi.hoTen} . Thành công !`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onGetDichVu(maDV: string): Promise<void> {
    try {
      this.dataDichVu = await this.dichVuService.getById(maDV);
      this.validateForm.controls.maDV.setValue(this.dataDichVu.maDV);
      this.validateForm.controls.donGia.setValue(this.dataDichVu.gia);
      this.modalDichVu = false;
      // this.message.info(`Chọn bác sĩ: ${this.dataBacSi.hoTen} . Thành công !`);
      this.modal = this.modalService.info({
        nzTitle: 'Thông tin',
        nzContent: `Chọn dịch vụ: ${this.dataDichVu.tenDv} . Thành công !`,
      });
    } catch (error) {
      console.log(error);
    }
  }


  async onGetBacSiThucHien(maNV: string): Promise<void> {
    try {
      this.dataBacSiThucHien = await this.nhanVienService.getById(maNV);
      this.validateForm.controls.maNV.setValue(this.dataBacSiThucHien.maNV);
      this.modalBacSiThucHien = false;
      this.modal = this.modalService.info({
        nzTitle: 'Thông tin',
        nzContent: `Chọn bác sĩ thực hiện: ${this.dataBacSiThucHien.hoTen} . Thành công !`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getFullYear()}/${(m.getMonth() + 1)}/${m.getDate()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  }

  onStartChange(date: Date): void {
    this.tuNgay = date;
  }

  onEndChange(date: Date): void {
    this.denNgay = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open);
    this.endOpen = open;
  }


  formatCurrency(money): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });

  }

  formatLabelDichVu(dv: any): string {
    return `${dv.tenDv}. Giá : ${this.formatCurrency(dv.gia)}`;
  }

  showModalBacSi(): void {
    this.modalBacSi = true;
  }

  onCancelModelBacSi(): void {
    this.modalBacSi = false;
  }

  showModalBacSiThucHien(): void {
    this.modalBacSiThucHien = true;
  }

  onCancelModelBacSiThucHien(): void {
    this.modalBacSiThucHien = false;
  }

  showModalDichVu(): void {
    this.modalDichVu = true;
  }

  onCancelModelDichVu(): void {
    this.modalDichVu = false;
  }

  getUrlInfiles(): string[] {
    return this.files.map(item => item.response.url);
  }

  showModalChiTietHinhAnh(url: string) {
    this.modalChiTietHinhAnh = true;
    console.log(url)
    this.hinhAnhChiTiet = url;
  }

  onCancelModalChiTietHinhAnh(): void {
    this.modalChiTietHinhAnh = false;
  }

}
