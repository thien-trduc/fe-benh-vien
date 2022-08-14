import { Abstract } from './../../helper/handling-abstract';
import { Kham } from '../../benh-an/model/benh-an.kham.model';

export class ToaThuoc extends Abstract {
    maToa: string;
    thucHienYLenh: string;
    kham: Kham;
}