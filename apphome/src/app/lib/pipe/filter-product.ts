import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../service/data/product';

@Pipe({
    name: 'productfilter',
    pure: false
})
export class productFilterPipe implements PipeTransform {
  transform(items: Product[], filter: Product): Product[] {
    if (!items || !filter) {
      return items;
    }
    
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Product) => this.applyFilter(item, filter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Product} product The product to compare to the filter.
   * @param {Product} filter The filter to apply.
   * @return {boolean} True if product satisfies filters, false if not.
   */
    applyFilter(product: Product, filter: Product): boolean {
      for (let field in filter) {
        if (filter[field]) {

          // Filter by String
          if (typeof filter[field] === 'string') {
            if (product[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
              return  false;
            }

          }else if(typeof filter[field] === 'boolean'){
            if (product[field] !== filter[field]) {
              return false;
            }
          
          // Filter by Number  
          }else if(typeof filter[field] === 'number') {

            // Filter Price
            if (field == 'price') {
              if (product[field] >= filter[field]) {
                return false;
              }

            // Filter Number Only 
            }else{ 
              if (product[field] !== filter[field]) {
                return false;
              }
            }
          
          // Filter by Size
          }else if(typeof filter[field] === 'object') {
            if(filter[field].includes(product[field])){
              return true;
            }else{
              return false;
            }
          }

        }
      }
      return true;
    }
}
