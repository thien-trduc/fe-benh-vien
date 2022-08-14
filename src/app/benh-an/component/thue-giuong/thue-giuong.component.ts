import { ChiTietPhongGiuong } from './../../../phong/model/phong.ct-giuong.dto';
import { PhongService } from './../../../phong/phong.service';
import { Phong } from './../../../phong/model/phong.model';
import { ThueGiuong } from './../../model/benh-an.thue-giuong.model';
import { USER_NHANVIEN } from './../../../helper/constant';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BenhAnService } from '../../benh-an.service';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-thue-giuong',
  templateUrl: './thue-giuong.component.html',
  styleUrls: ['./thue-giuong.component.css']
})
export class ThueGiuongComponent implements OnInit {
  @Input() isXuatHoaDon: boolean;

  title = `Thuê giường`;
  maNV = USER_NHANVIEN;
  data: ThueGiuong;
  datas: ThueGiuong[] = [];
  dataGiuongSelected: ChiTietPhongGiuong;
  searchResult: ThueGiuong[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = false;
  modalCtPhong = false;
  modalThueGiuong = false;
  tuNgay: Date;
  denNgay: Date;
  validateForm: FormGroup;
  startValue: Date | null = null;
  endValue: Date | null = null;
  endOpen = false;
  modal: NzModalRef;


  constructor(
    private service: BenhAnService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private phongService: PhongService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NzModalService,
  ) { }

  async ngOnInit() {
     this.maNV = JSON.parse(localStorage.getItem('currentUser')).maNV;
    this.validateForm = this.fb.group({
      idCtPhongGiuong: [null, [Validators.required]],
      ngayThue: [null, [Validators.required]],
      ngayTra: [null, [Validators.required]],
      donGia: [null, [Validators.required]],
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
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      return;
    }
    try {
      const id = this.route.snapshot.paramMap.get('id');
      const formData = { ...this.validateForm.value };
      if (this.data) {
        await this.service.updateThueGiuong(id, this.data.ctPhongGiuong.id, formData);
      } else {
        await this.service.createThueGiuong(id, formData);
      }

      this.message.info(`Lưu thành công`);
      this.onLamMoi();
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
    } = await this.service.getThueGiuongs(id, this.pageIndex, this.pageSize, this.sortKey, this.sortValue, query);
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
        } = await this.service.searchThueGiuongs(id, this.pageIndex, this.pageSize, { tuNgay: this.tuNgay, denNgay: this.denNgay });
        this.datas = rows;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async delete(idCtGiuong: string): Promise<void> {
    try {
      console.log(idCtGiuong)
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.deleteThueGiuongById(id, idCtGiuong);
      this.refesh();
      this.modal = this.modalService.success({
        nzTitle: 'Thuê Giường',
        nzContent: `Xóa thành công`,
      });
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: error,
      });
    }
  }

  onLamMoi(): void {
    this.data = null;
    this.modalCtPhong = false;
    this.modalThueGiuong = false;
    this.validateForm.reset();
    this.dataGiuongSelected = null;
    this.tuNgay = null;
    this.denNgay = null;
    this.pageSize = 5,
      this.pageIndex = 1,
      this.total = 1,
      this.sortValue = null,
      this.sortKey = null,
      this.refesh();
  }

  async openModelChiTiet(idCtPhongGiuong: string = ''): Promise<void> {
    try {
      this.modalThueGiuong = true;
      this.validateForm.reset();
      if (idCtPhongGiuong) {
        const maBA = this.route.snapshot.paramMap.get('id');
        this.data = await this.service.getThueGiuongById(maBA, idCtPhongGiuong);
        this.dataGiuongSelected = await this.phongService.getPhongGiuongByID(
          this.data.ctPhongGiuong.phong.maPhong.toString(),
          parseInt(idCtPhongGiuong)
          );
        const { ctPhongGiuong, benhAn, ...data } = this.data;
        this.validateForm.setValue({ ...data, idCtPhongGiuong });
      }
    } catch (error) {
      console.log(error)
    }
  }

  async onCancelModelCtDichVu(): Promise<void> {
    this.onLamMoi();
  }

  showModalThueGiuong(): void {
    this.modalThueGiuong = true;
  }

  onCancelModelThueGiuong(): void {
    this.modalThueGiuong = false;
  }

  async onGetGiuong(idCtPhongGiuong: number): Promise<void> {
    const phong = '1';
    this.dataGiuongSelected = await this.phongService.getPhongGiuongByID(phong, idCtPhongGiuong);
    this.validateForm.controls.idCtPhongGiuong.setValue(idCtPhongGiuong);
    this.validateForm.controls.donGia.setValue(this.dataGiuongSelected.gia);

    this.modalCtPhong = false;
  }

  showModalPhongGiuong(): void {
    this.modalCtPhong = true;
  }

  onCancelModelPhongGiuong(): void {
    this.modalCtPhong = false;
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


  formatCurrency(money): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }

  formatGiaLabel(ct: any): string {
    return `Số : ${ct.giuong.soGiuong}. Giá : ${this.formatCurrency(ct.gia)}`;
  }

  disabledDate(current): any {
    const date = new Date();
    return current && current >= date;
  }

  disabledDateNgayTra(current): any {
    const date = new Date();
    return current && current <= date;
  }

}
