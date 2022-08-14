import { TOA_THUOC_DETAIL_ROUTE, TOA_THUOC_ROUTE, TOA_THUOC_ADD_ROUTE } from './../../../helper/constant';
import { ToaThuocService } from './../../../toa-thuoc/toa-thuoc.service';
import { NhanVien } from './../../../nhan-vien/model/nhan-vien.model';
import { NhanVienService } from './../../../nhan-vien/nhan-vien.service';
import { BenhNhanService } from './../../../benh-nhan/benh-nhan.service';
import { Kham } from '../../model/benh-an.kham.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BenhAnService } from '../../benh-an.service';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as endOfMonth from 'date-fns/end_of_month';


@Component({
  selector: 'app-kham-ba-list',
  templateUrl: './kham.component.html',
  styleUrls: ['./kham.component.css']
})
export class KhamComponent implements OnInit {
  @Input() isXuatHoaDon: boolean;
  @Output() public eventBacSiChiDinh = new EventEmitter<string>();

  title = `Khám bệnh`;
  kham: Kham;
  datas: Kham[] = [];
  searchResult: Kham[] = [];
  pageSize = 3;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = false;
  modalKham = false;
  modalBacSi = false;
  modalYta = false;
  idUpdate: string;
  tuNgay: Date;
  denNgay: Date;
  bacSi: NhanVien;
  yTa: NhanVien;
  validateForm: FormGroup;
  startValue: Date | null = null;
  endValue: Date | null = null;
  endOpen = false;
  modal: NzModalRef;

  constructor(
    private service: BenhAnService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private toaThuocService: ToaThuocService,
    private nhanVienService: NhanVienService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
  ) { }

  async ngOnInit() {
    this.validateForm = this.fb.group({
      maBacSi: [null, [Validators.required]],
      maYta: [null],
      chanDoan: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      tinhTrang: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      ngayKham: [null, [Validators.required]],
    });
    this.refesh();
  }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const { chanDoan, tinhTrang, ...data } = this.validateForm.value;
    this.validateForm.setValue({
        ...data,
        chanDoan: chanDoan ? chanDoan.trim() : '',
        tinhTrang: tinhTrang ? tinhTrang.trim() : '',
    });
    if (this.validateForm.invalid) {
      // this.message.info(`Xin hãy điền đẩy đủ thông tin`);
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      return;
    }
    console.log(this.validateForm.value)
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (this.idUpdate) {
        await this.service.updateKham(this.idUpdate, {...this.validateForm.value, maBA: id});
      } else {
        await this.service.createKham({...this.validateForm.value, maBA: id});
      }
      this.kham = null;
      this.idUpdate = null;
      this.modalKham = false;
      this.onLamMoi();
      this.validateForm.reset();
      this.message.info(`Lưu thành công`);
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: error,
      });
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
    } = await this.service.fetchKham(id, this.pageIndex, this.pageSize, this.sortKey, this.sortValue, query);
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
        } = await this.service.searchKhams(id, this.pageIndex, this.pageSize, { tuNgay: this.tuNgay, denNgay: this.denNgay });
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

  async delete(idKham: number): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.deleteKham(idKham.toString());
      this.refesh();
      this.message.info(`Xóa Thành Công`);
    } catch (error ) {
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: error,
      });
    }
  }

  onLamMoi(): void {
    this.tuNgay = null;
    this.denNgay = null;
    this.pageSize = 3,
      this.pageIndex = 1,
      this.total = 1,
      this.sortValue = null,
      this.sortKey = null,
      this.refesh();
  }

  async openModelUpdate(idkham: number): Promise<void> {
    this.idUpdate = idkham.toString();
    this.showModal();
  }

  async openModelAdd(): Promise<void> {
    this.idUpdate = null;
    this.showModal();
  }

  async onCancelModelKham(): Promise<void> {
    this.idUpdate = null;
    this.modalKham = false;
    this.kham = null;
    this.validateForm.reset();
  }

  async showModal(): Promise<void> {
    try {
      this.modalKham = true;
      this.validateForm.reset();
      if (this.idUpdate) {
        this.kham = await this.service.getKhamById(this.idUpdate);
        const { id, bacSi, yta, existToaThuoc, benhAn, ...data } = this.kham;
        const maYta = yta ? yta.maNV : '';
        this.validateForm.setValue({ ...data, maBacSi: bacSi.maNV, maYta });
      }
    } catch (error) {
      console.log(error);
    }
  }

  showModalBacSi(): void {
    this.modalBacSi = true;
  }

  onCancelModelBacSi(): void {
    this.modalBacSi = false;
  }

  async onGetBacSi(maNV: string): Promise<void> {
    try {
      this.bacSi = await this.nhanVienService.getById(maNV);
      this.validateForm.controls.maBacSi.setValue(this.bacSi.maNV);
      this.modalBacSi = false;
      this.eventBacSiChiDinh.emit(maNV);
      this.modal = this.modalService.info({
        nzTitle: 'Thông tin',
        nzContent: `Chọn bác sĩ: ${this.bacSi.hoTen} . Thành công !`,
      });
      // this.message.info(`Chọn bác sĩ: ${this.bacSi.hoTen} . Thành công !`);
    } catch (error ) {
      console.log(error);
    }
  }

  showModalYta(): void {
    this.modalYta = true;

  }

  onCancelModelYta(): void {
    this.modalYta = false;
  }



  async onGetYta(maNV: string): Promise<void> {
    try {
      this.yTa = await this.nhanVienService.getById(maNV);
      this.validateForm.controls.maYta.setValue(this.yTa.maNV);
      this.modalYta = false;
      this.modal = this.modalService.info({
        nzTitle: 'Thông tin',
        nzContent: `Chọn y tá: ${this.yTa.hoTen} . Thành công !`,
      });
      // this.message.info(`Chọn y tá: ${this.yTa.hoTen} . Thành công !`);
    } catch (error) {
      console.log(error);
    }
  }

  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
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

  async redirectThuoc(maKham: number): Promise<void> {
    try {
      const exist = await this.toaThuocService.existToaThuocKham(maKham);
      if (exist) {
        this.router.navigate([`/${TOA_THUOC_ROUTE}/${TOA_THUOC_DETAIL_ROUTE}/${exist.maToa}`]);
      } else {
        this.router.navigateByUrl(`/${TOA_THUOC_ROUTE}/${TOA_THUOC_ADD_ROUTE}?makham=${maKham}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  disabledDate(current): any {
    const date = new Date();
    return current && current >= date;
  }

  hideToaThuocLessCurentDate(existToaThuoc: boolean, ngayKham: string): boolean {
    const current = new Date();
    const ngayKhamDate = new Date(ngayKham);
    return (!existToaThuoc && current.getDate().valueOf() > ngayKhamDate.getDate().valueOf()) ? false : true;
  }

  
}
