import { BenhNhan } from './../benh-nhan.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { getServerErrorMessage } from 'src/app/helper/handling-error';

import { BenhNhanService } from '../benh-nhan.service';
import { BENH_NHAN_ROUTE, BENH_NHAN_DETAIL_ROUTE, BENH_AN_ROUTE } from './../../helper/constant';
import { environment } from 'src/environments/environment';
import { BenhAn } from 'src/app/benh-an/model/benh-an.model';
import { BenhAnService } from 'src/app/benh-an/benh-an.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  title = 'Bệnh Nhân';
  benhNhan: BenhNhan;
  validateForm: FormGroup;
  listRoute = `/${BENH_NHAN_ROUTE}`;
  editRoute = `/${BENH_NHAN_DETAIL_ROUTE}`;
  modal: NzModalRef;

  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${BENH_NHAN_ROUTE}`;

  datas: BenhAn[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private service: BenhNhanService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService,
    private benhAnService: BenhAnService,
  ) { }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const { hoTen, diaChi, ...data } = this.validateForm.value;
    this.validateForm.setValue({
      ...data,
      hoTen: hoTen ? hoTen.trim().toUpperCase() : '',
      diaChi: diaChi ? diaChi.trim() : '',
    });
    if (this.validateForm.invalid) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: `Xin hãy điền đầy đủ thông tin`,
      })
      return;
    }
    try {
      const id = this.route.snapshot.paramMap.get('id');
      const res = await this.service.update(id, this.validateForm.value);
      this.router.navigate([`${this.listRoute}${this.editRoute}/${res.cmnd}`]);
      this.modal = this.modalService.success({
        nzTitle: 'Bệnh nhân',
        nzContent: `Lưu thành công !`,
      });
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: error,
      });
    }
  }


  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      cmnd: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[0-9]+')]],
      hoTen: [null, [Validators.required, Validators.maxLength(50)]],
      gioiTinh: [null, [Validators.required]],
      ngaySinh: [null, [Validators.required]],
      diaChi: [null, [Validators.required, Validators.maxLength(100)]],
      soDienThoai: [
        null,
        [Validators.required, Validators.maxLength(20), Validators.pattern(`(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})`)]
      ],
      email: [null, [Validators.email, Validators.maxLength(100)]],
      bhyt: [null, [Validators.minLength(8), Validators.maxLength(15)]],
      hinhAnh: [null, [Validators.maxLength(255)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    try {
      this.benhNhan = await this.service.getById(id);
      const { createdAt, updatedAt, deletedAt, doiTuong, ...data } = this.benhNhan;
      this.validateForm.setValue({ ...data });

    } catch (error) {
      console.log(error);
    }
    this.refesh({ benhNhan: { cmnd: id } });
  }

  disabledDate(current): any {
    return current && current.valueOf() > Date.now();
  }

  customReq = async (item: UploadXHRArgs) => {
    const res = await this.service.uploadV2(item.file);
    this.validateForm.controls.hinhAnh.setValue(res.url);
    this.files = [{ url: res.url }];
    return res;
  }

  removeHinhAnh = (file: UploadFile) => {
    console.log(file)
  }

  sort(sort: { key: string; value: string }): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.refesh({ benhNhan: { cmnd: id } });
  }

  refesh(query: any = {}): void {
    this.loading = true;
    this.benhAnService.searchBenhAnByCMND(
      this.pageIndex,
      this.pageSize,
      query,
    )
      .then(res => {
        const {
          pageIndex,
          pageSize,
          total,
          rows
        } = res;
        this.datas = rows;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;
      })
      .catch(error => console.log(error));
  }

  async onPageChange(reset: boolean = false): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (reset) {
      this.pageIndex = 1;
    }
    this.refesh({ benhNhan: { cmnd: id } });

  }

  getUrlEdit(id: string): string {
    return `/${BENH_AN_ROUTE}/${BENH_NHAN_DETAIL_ROUTE}/${id}`;
  }


  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }
}
