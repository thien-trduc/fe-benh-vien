import { Abstract } from '../../helper/handling-abstract';
import { Khoa } from '../../khoa/khoa.model';

export class Phong extends Abstract {
    maPhong: number;
    soPhong: string;
    khoa: Khoa;
    gia: string;
}
