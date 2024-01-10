import { ElementContainer } from '../element-container';
import { CacheStorage } from '../../core/cache-storage';
export class ImageElementContainer extends ElementContainer {
    constructor(img) {
        super(img);
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
        CacheStorage.getInstance().addImage(this.src);
    }
}
