import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../service/data/product';
import { AvailableItemInfo } from '../../services/app-data-model/app-data-model';

@Pipe({
  name: 'SellerFilter',
  pure: false
})
export class SellerFilterPipe implements PipeTransform {

  transform(items: AvailableItemInfo[], filter: any): AvailableItemInfo[] {
    if (!items || !filter) {
      return items;
    }

    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: AvailableItemInfo) => this.applyFilter(item, filter));
  }

  /**
   * Perform the filtering.
   * 
   * @param {Product} product The product to compare to the filter.
   * @param {Product} filter The filter to apply.
   * @return {boolean} True if product satisfies filters, false if not.
   */
  applyFilter(availableItemInfo: AvailableItemInfo, filter: any): boolean {
    //console.log("SellerFilterPipe.applyFilter()...filter=" + JSON.stringify(filter));
    //console.log("filter.seller_sellerGroup="+filter.seller_sellerGroup+" ::: availableItemInfo.seller.sellerGroup="+availableItemInfo.seller.sellerGroup);
    if (filter.seller_sellerGroup != null && filter.seller_sellerGroup.length != 0) {
      if (availableItemInfo.seller != null && availableItemInfo.seller.sellerGroup != null && availableItemInfo.seller.sellerGroup === filter.seller_sellerGroup) {
        //console.log("true")
        return true;
      } else {
        //console.log("false")
        return false;
      }

    }
    /*
    for (let field in filter) {
      if (filter[field]) {

        // Filter by String
        if (typeof filter[field] === 'string') {
          if (product[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }

        } else if (typeof filter[field] === 'boolean') {
          if (product[field] !== filter[field]) {
            return false;
          }

          // Filter by Number  
        } else if (typeof filter[field] === 'number') {

          // Filter Price
          if (field == 'price') {
            if (product[field] >= filter[field]) {
              return false;
            }

            // Filter Number Only 
          } else {
            if (product[field] !== filter[field]) {
              return false;
            }
          }

          // Filter by Size
        } else if (typeof filter[field] === 'object') {
          if (filter[field].includes(product[field])) {
            return true;
          } else {
            return false;
          }
        }

      }
    }
    */
    return true;
  }
}
