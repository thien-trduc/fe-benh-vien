import { Giuong } from './../../../giuong/giuong.model';
import { KhoaService } from './../../../khoa/khoa.service';
import { PhongService } from './../../phong.service';
import { PhongCapNhat } from './../../model/phong.cap-nhat.model';
import { Phong } from './../../model/phong.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PHONG_ROUTE } from 'src/app/helper/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Khoa } from 'src/app/khoa/khoa.model';
import { GiuongService } from 'src/app/giuong/giuong.service';
import { ChiTietPhongGiuong } from '../../model/phong.ct-giuong.dto';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  title = 'Phòng';
  phong: Phong;
  khoas: Khoa[];
  giuongs: Giuong[];
  listRoute = `/${PHONG_ROUTE}`;

  datas: PhongCapNhat[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;

  datasCt: ChiTietPhongGiuong[] = [];
  pageSizeCt = 5;
  pageIndexCt = 1;
  totalCt = 1;
  sortValueCt: string | null = null;
  sortKeyCt: string | null = null;
  loadingCt = true;

  isVisibleCtGiuong = false;
  isVisibleGia = false;

  validateForm: FormGroup;
  validateFormGia: FormGroup;
  validateFormChiTietGiuong: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private service: PhongService,
    private khoaService: KhoaService,
    private giuongService: GiuongService,
  ) { }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    this.validateForm = this.fb.group({
      soPhong: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+')]],
      maKhoa: [null, [Validators.required]]
    });

    this.validateFormGia = this.fb.group({
      ngayCapNhat: [null, [Validators.required]],
      gia: [null, [Validators.required, Validators.pattern('^[0-9]+')]],
      ghiChu: [null, [Validators.maxLength(255)]],
    });

    this.validateFormChiTietGiuong = this.fb.group({
      maGiuong: [null, [Validators.required]],
    });

    try {
      const [resPhong, resKhoa, resGiuong] = await Promise.all([
        this.service.getById(id),
        this.khoaService.fetch(1, 10000, null, null),
        this.giuongService.fetch(1, 10000, null, null),
        this.refesh(),
        this.refeshCt()
      ]);
      this.phong = resPhong;
      this.khoas = resKhoa.rows;
      this.giuongs = resGiuong.rows;
      const { createdAt, updatedAt, deletedAt ,gia , khoa, maPhong, ...data } = resPhong;
      this.validateForm.setValue({ ...data, maKhoa: khoa.maKhoa });
    } catch (error) {
      this.message.error(` ${error}`);
    }

  }

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
      this.message.info(`Lưu thành công`);
      this.router.navigate([PHONG_ROUTE]);
    } catch ({ error }) {
      this.message.error(`Lưu thất bại ${error.message}`);
    }
  }

  async submitFormGia(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormGia.controls) {
      this.validateFormGia.controls[i].markAsDirty();
      this.validateFormGia.controls[i].updateValueAndValidity();
    }
    if (this.validateFormGia.invalid) {
      this.message.info(`Xin hãy điền đẩy đủ thông tin`);
      return;
    }
    try {
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.storeGia(id, this.validateFormGia.value);
      this.message.info(`Lưu thành công`);
      this.refesh();
      this.isVisibleGia = false;
    } catch ({ error }) {
      this.message.error(`Lưu thất bại ${error.message}`);
    }
  }

  async deleteGia(ngayCapNhat: string): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.deleteGia(id, ngayCapNhat);
      this.refesh();
      this.message.info(`Xóa Thành Công`);
    } catch ({ error }) {
      this.message.error(error.message);
    }
  }

  showModal(): void {
    this.isVisibleGia = true;
  }

  handleCancel(): void {
    this.isVisibleGia = false;
  }

  formatCurrency(money): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.refesh();
  }

  async onPageChange(reset: boolean = false): Promise<void> {
    if (reset) {
      this.pageIndex = 1;
    }
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
    } = await this.service.getGias(id, this.pageIndex, this.pageSize, this.sortKey, this.sortValue, { maPhong: id });
    this.datas = rows;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
    this.loading = false;
  }

  async submitFormChiTietGiuong(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormChiTietGiuong.controls) {
      this.validateFormChiTietGiuong.controls[i].markAsDirty();
      this.validateFormChiTietGiuong.controls[i].updateValueAndValidity();
    }
    if (this.validateFormChiTietGiuong.invalid) {
      this.message.info(`Xin hãy điền đẩy đủ thông tin`);
      return;
    }
    try {
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.storeCtGiuong({ ...this.validateFormChiTietGiuong.value, maPhong: id });
      this.message.info(`Lưu thành công`);
      this.refeshCt();
      this.isVisibleCtGiuong = false;
    } catch ({ error }) {
      this.message.error(`Lưu thất bại ${error.message}`);
    }
  }

  showModalCtGiuong(): void {
    this.isVisibleCtGiuong = true;
  }

  handleCancelCtGiuong(): void {
    this.isVisibleCtGiuong = false;
  }

  async deleteChiTietGiuong(idChiTiet: string): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.deleteGiuongs(id, idChiTiet);
      this.refeshCt();
      this.message.info(`Xóa Thành Công`);
    } catch ({ error }) {
      this.message.error(error.message);
    }
  }
  sortCt(sort: { key: string; value: string }): void {
    this.sortKeyCt = sort.key;
    this.sortValueCt = sort.value;
    this.refeshCt();
  }

  async onPageChangeCt(reset: boolean = false): Promise<void> {
    if (reset) {
      this.pageIndex = 1;
    }
    this.refeshCt();
  }

  async refeshCt(query: any = {}): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadingCt = true;
    const {
      pageIndex,
      pageSize,
      total,
      rows
    } = await this.service.fetchChiTietGiuongs(id, this.pageIndexCt, this.pageSizeCt, this.sortKeyCt, this.sortValueCt, { maPhong: id });
    this.datasCt = rows;
    this.pageIndexCt = pageIndex;
    this.pageSizeCt = pageSize;
    this.totalCt = total;
    this.loadingCt = false;
  }

}
