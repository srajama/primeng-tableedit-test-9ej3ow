import { Component, ViewChild } from "@angular/core";
import { ProductService } from "./productservice";
import { Product } from "./product";
import { FilterUtils } from "primeng/utils";
import { LazyLoadEvent } from "primeng/api";
import { SelectItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { Table } from "primeng/table";

export function tableFactory(parent: AppComponent) {
  return parent.table;
}
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [
    MessageService,
    {
      provide: Table,
      useFactory: tableFactory,
      deps: [AppComponent]
    }
  ],
  styles: [
    `
      :host ::ng-deep .p-cell-editing {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `
  ]
})
export class AppComponent {
  products1: Product[];

  products2: Product[];

  statuses: SelectItem[];

  @ViewChild("dt", { static: true }) table: Table;

  columns: (keyof Product)[] = ["code", "name", "inventoryStatus", "quantity"];

  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.productService
      .getProductsSmall()
      .then(data => (this.products1 = data));
    this.productService
      .getProductsSmall()
      .then(data => (this.products2 = data));

    this.statuses = [
      { label: "In Stock", value: "INSTOCK" },
      { label: "Low Stock", value: "LOWSTOCK" },
      { label: "Out of Stock", value: "OUTOFSTOCK" }
    ];
  }

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: Product) {
    console.log("save", event);
    if (product.price > 0) {
      delete this.clonedProducts[product.id];
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Product is updated"
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Invalid Price"
      });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.products2[index] = this.clonedProducts[product.id];
    delete this.products2[product.id];
  }

  onCellEditComplete(event: any) {
    console.log("event", event);
  }
}
