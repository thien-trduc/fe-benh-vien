import { HttpErrorResponse } from '@angular/common/http';

export function getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            return `Lỗi không tìm thấy : ${error.message}`;
        }
        case 403: {
            return `Lỗi bị từ chối: ${error.message}`;
        }
        case 401: {
            return `Lỗi không có quyền truy cập: ${error.message}`;
        }
        case 500: {
            return `Lỗi : ${error.message}`;
        }
        case 442: {
            return `Lỗi : ${error.message}`;
        }
        default: {
            return `Lỗi Không Xác Định: ${error.message}`;
        }

    }
}