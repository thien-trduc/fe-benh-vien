import { Phong } from './phong.model';
import { Giuong } from './../../giuong/giuong.model';

export class ChiTietPhongGiuong {
    id: string;
    giuong: Giuong;
    phong: Phong;
    trangThai: boolean;
    gia: number;
}