import { first } from 'lodash';
import { NhanVien } from './../../../nhan-vien/model/nhan-vien.model';
import { BenhNhan } from './../../../benh-nhan/benh-nhan.model';
import { NhanVienService } from './../../../nhan-vien/nhan-vien.service';
import { BenhNhanService } from './../../../benh-nhan/benh-nhan.service';
import {
    BENH_AN_ROUTE,
    BENH_AN_DETAIL_ROUTE,
    XUAT_VIEN_ROUTE,
    XUAT_VIEN_DETAIL_ROUTE,
    XUAT_VIEN_ADD_ROUTE,
    HOA_DON_DETAIL_ROUTE, HOA_DON_ROUTE,
    HOA_DON_ADD_ROUTE,
    TAM_UNG_ROUTE,
    TAM_UNG_ADD_ROUTE
} from './../../../helper/constant';
import { BenhAn } from './../../model/benh-an.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { BenhAnService } from '../../benh-an.service';
import { HoaDonService } from 'src/app/hoa-don/hoa-don.service';
import { XuatVienService } from 'src/app/xuat-vien/xuat-vien.service';


@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    title = 'Bệnh Án';
    benhAn: BenhAn;
    validateForm: FormGroup;
    hinhAnh: string;
    benhNhan: BenhNhan;
    nvLap: NhanVien;
    editRoute = `/${BENH_AN_DETAIL_ROUTE}`;
    listRoute = `/${BENH_AN_ROUTE}`;
    isXuatHoaDon = false;
    modal: NzModalRef;
    maBacSiChiDinh: string;

    constructor(
        private fb: FormBuilder,
        private service: BenhAnService,
        private benhNhanService: BenhNhanService,
        private hoaDonSerivce: HoaDonService,
        private xuatVienService: XuatVienService,
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
            this.message.info(`Xin hãy điền đẩy đủ thông tin`);
            return;
        }
        try {
            const id = this.route.snapshot.paramMap.get('id');
            await this.service.update(id, this.validateForm.value);
            this.modal = this.modalService.info({
                nzTitle: `Bệnh án ${id}`,
                nzContent: `Lưu thành công !`,
                nzMaskClosable: true
            });
            this.router.navigate([`${this.listRoute}${this.editRoute}/${id}`]);
        } catch (error) {
            this.modal = this.modalService.error({
                nzTitle: 'LỖI',
                nzContent: error,
            });
        }
    }

    async ngOnInit(): Promise<void> {
        this.validateForm = this.fb.group({
            maBA: [null, [Validators.minLength(8), Validators.maxLength(25)]],
            chieuCao: [null, [Validators.pattern('^-?[0-9]*(\.[0-9]+)?')]],
            canNang: [null, [Validators.pattern('^-?[0-9]*(\.[0-9]+)?')]],
            tienSu: [null, [Validators.maxLength(255)]],
        });
        const id = this.route.snapshot.paramMap.get('id');
        this.benhAn = await this.service.getById(id);
        const { createdAt, updatedAt, deletedAt, nhanVien, benhNhan, ngayLap, trangThai, ...data } = this.benhAn;
        this.hinhAnh = benhNhan.hinhAnh;
        this.benhNhan = benhNhan;
        this.validateForm.setValue({ ...data });
        const resHoaDon = await this.hoaDonSerivce.fetch(1, 1, null, null, { benhAn: { maBA: id } });
        if (resHoaDon.rows && resHoaDon.rows.length > 0) {
            this.isXuatHoaDon = true;
        }

        const maBacSiChiDinh = sessionStorage.getItem('bacSi');
        if(maBacSiChiDinh) {
            this.maBacSiChiDinh = maBacSiChiDinh;
        }


    }

    redirectPhieuTamUng(): void {
        const maBA = this.route.snapshot.paramMap.get('id');
        this.router.navigateByUrl(`/${TAM_UNG_ROUTE}/${TAM_UNG_ADD_ROUTE}?maBA=${maBA}`);
    }

    async redirectPhieuXuatVien(): Promise<void> {
        const maBA = this.route.snapshot.paramMap.get('id');
        try {
            const benhAn = { maBA }
            const res = await this.xuatVienService.fetch(1, 1, null, null, { benhAn });
            if (res.rows && res.rows.length > 0) {
                const xuatVien = first(res.rows);
                this.router.navigateByUrl(`/${XUAT_VIEN_ROUTE}/${XUAT_VIEN_DETAIL_ROUTE}/${xuatVien.maPXV}?maBA=${maBA}`);
            } else {
                this.router.navigateByUrl(`/${XUAT_VIEN_ROUTE}/${XUAT_VIEN_ADD_ROUTE}?maBA=${maBA}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async redirectHoaDon(): Promise<void> {
        try {
            const maBA = this.route.snapshot.paramMap.get('id');
            const benhAn = { maBA };
            const res = await this.hoaDonSerivce.fetch(1, 1, null, null, { benhAn });
            if (res.rows && res.rows.length > 0) {
                const hoaDon = first(res.rows);
                this.router.navigateByUrl(`/${HOA_DON_ROUTE}/${HOA_DON_DETAIL_ROUTE}/${hoaDon.maHD}?maBA=${maBA}`);
            } else {
                this.router.navigateByUrl(`/${HOA_DON_ROUTE}/${HOA_DON_ADD_ROUTE}?maBA=${maBA}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    onGetBacSiChiDinh(maNV: string): void {
        this.maBacSiChiDinh = maNV;
    }
}
