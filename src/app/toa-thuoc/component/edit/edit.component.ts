import { ToaThuoc } from './../../model/toa-thuoc.model';
import { ThuocService } from './../../../thuoc/thuoc.service';
import { Thuoc } from './../../../thuoc/model/thuoc.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';

import { TOA_THUOC_DETAIL_ROUTE, TOA_THUOC_ROUTE } from './../../../helper/constant';
import { ToaThuocService } from './../../toa-thuoc.service';
import { ChiTietToaThuoc } from '../../model/toa-thuoc.chi-tiet.model';
import { HoaDonService } from 'src/app/hoa-don/hoa-don.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    title = 'Toa Thuốc';
    toaThuoc: ToaThuoc;
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
    chiTietThuocEdit: ChiTietToaThuoc;
    thuocSelectedEdit: string;
    isXuatHoaDon = false;
    modal: NzModalRef;


    constructor(
        private fb: FormBuilder,
        private service: ToaThuocService,
        private thuocService: ThuocService,
        private hoaDonService: HoaDonService,
        private router: Router,
        private route: ActivatedRoute,
        private message: NzMessageService,
        private modalService: NzModalService) { }

    async submitChonThuoc(): Promise<void> {
        // tslint:disable-next-line: forin
        for (const i in this.validateFormChonThuoc.controls) {
            this.validateFormChonThuoc.controls[i].markAsDirty();
            this.validateFormChonThuoc.controls[i].updateValueAndValidity();
        }
        if (this.validateFormChonThuoc.invalid) {
            this.message.error(`Xin hãy điền đẩy đủ thông tin`);
            return;
        }
        try {
            const id = this.route.snapshot.paramMap.get('id');
            if (this.chiTietThuocEdit) {
                await this.service.updateChiTietToaThuoc(id, this.thuocSelectedEdit, this.validateFormChonThuoc.value);
            } else {
                await this.service.createChiTietToaThuoc(id, this.validateFormChonThuoc.value);
            }
            this.chiTietThuocEdit = null;
            this.thuocSelectedEdit = null;
            this.modalChiTiets = false;
            this.chiTietToas = (await this.service.getChiTietToaThuoc(id, 1, 10000, null, null)).rows;
        } catch (error) {
            this.modal = this.modalService.error({
                nzTitle: 'Lỗi',
                nzContent: error,
            });
        }

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
                nzTitle: 'LỖI',
                nzContent: `Xin hãy điền đẩy đủ thông tin`,
            });
            return;
        }
        try {
            const id = this.route.snapshot.paramMap.get('id');
            await this.service.update(id, { ...this.validateForm.value });
            this.modal = this.modalService.success({
                nzTitle: 'Lưu',
                nzContent: `Lưu thành công`,
            });
            this.router.navigateByUrl(`${TOA_THUOC_ROUTE}/${TOA_THUOC_DETAIL_ROUTE}/${id}`);
        } catch (error) {
            this.modal = this.modalService.error({
                nzTitle: 'LỖI',
                nzContent: error,
            });
        }
    }

    async ngOnInit(): Promise<void> {
        this.validateForm = this.fb.group({
            maToa: [null, [Validators.maxLength(25)]],
            thucHienYLenh: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
        });

        this.validateFormChonThuoc = this.fb.group({
            maThuoc: [null, [Validators.required, Validators.maxLength(25)]],
            soLuong: [null, [Validators.required, Validators.pattern('^-?[0-9]*(\.[0-9]+)?')]],
            cachDung: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
            donGia: [null, [Validators.required]]
        });

        const id = this.route.snapshot.paramMap.get('id');
        const [toaThuoc, chiTietToas] = await Promise.all([
            this.service.getById(id),
            this.service.getChiTietToaThuoc(id, 1, 10000, null, null)
        ])
        this.toaThuoc = toaThuoc;
        this.chiTietToas = chiTietToas.rows;
        const { kham, createdAt, updatedAt, deletedAt, ...data } = this.toaThuoc;
        this.validateForm.setValue({ ...data });
        const resHoaDon = await this.hoaDonService.fetch(1, 1, null, null, { benhAn: { maBA: kham.benhAn.maBA } });
        if (resHoaDon.rows && resHoaDon.rows.length > 0) {
            this.isXuatHoaDon = true;
        }
    }

    async showChiTietModal(maThuoc: string = ''): Promise<void> {
        this.modalChiTiets = true;
        this.validateFormChonThuoc.reset();
        if (maThuoc) {
            const id = this.route.snapshot.paramMap.get('id');
            this.chiTietThuocEdit = await this.service.getChiTietById(id, maThuoc);
            this.thuocSelectedEdit = maThuoc;
            const { thuoc, ...data } = this.chiTietThuocEdit;
            this.validateFormChonThuoc.setValue({ maThuoc, ...data });
            console.log(this.chiTietThuocEdit)
        }
    }

    cancelModalChiTiet(): void {
        this.modalChiTiets = false;
        this.chiTietThuocEdit = null;
        this.thuocSelectedEdit = null;
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
            this.modal = this.modalService.error({
                nzTitle: 'LỖI',
                nzContent: error,
            });
        }
    }

    showModalKham() {
        this.modalKhams = true;
    }

    cancelModalKham() {
        this.modalKhams = false;
    }

    // onGetKham(maKham: number): void {
    //     try {
    //         this.validateForm.controls.idCtKham.setValue(maKham);
    //         this.modalKhams = false;
    //         this.khamSelected = maKham;
    //         // this.message.info(`Chọn thuốc mã khám: ${maKham} . Thành công !`);
    //         this.modal = this.modalService.info({
    //             nzTitle: 'Thông tin',
    //             nzContent: `Chọn mã khám: ${maKham} . Thành công !`,
    //         });
    //     } catch (error) {
    //         this.modal = this.modalService.error({
    //             nzTitle: 'LỖI',
    //             nzContent: error,
    //         });
    //     }
    // }

    async deleteChiTietThuoc(maThuoc: string): Promise<any> {
        try {
            const id = this.route.snapshot.paramMap.get('id');
            console.log(maThuoc)
            await this.service.deleteChiTietToaThuoc(id, maThuoc);
            this.chiTietToas = (await this.service.getChiTietToaThuoc(id, 1, 10000, null, null)).rows;
        } catch (error) {
            console.log(error);
        }
    }


    formatCurrency(money: number): string {
        // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
        return money ? money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : '0';
    }

    formatDate(date: string): string {
        const m = new Date(date);
        return `
        ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
        `;
    }

    async exportToaThuoc(): Promise<any> {
        try {
            if (this.toaThuoc) {
                return this.service.exportToacThuoc(this.toaThuoc.maToa);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
