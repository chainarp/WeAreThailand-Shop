import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../service/data/product';
import { AvailableItemInfo } from '../../services/app-data-model/app-data-model';

@Pipe({
  name: 'AvailableProductFilter',
  pure: false
})
export class AvailableProductFilterPipe implements PipeTransform {

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
    // /console.log("AvailableProductFilterPipe.applyFilter()...filter=" + JSON.stringify(filter));
    if (filter.productItem_productGroup != null && filter.productItem_productGroup.length != 0) {
      if (availableItemInfo.productItem != null && availableItemInfo.productItem.productGroup != null && availableItemInfo.productItem.productGroup === filter.productItem_productGroup) {
        return true;
      } else {
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
