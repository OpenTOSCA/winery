"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v20.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 */
var core_1 = require("@angular/core");
var util_1 = require("util");
/**
 * This component provides an easy and fast way to use the ng2-table with further modifications
 * for the winery. It already enables the search, pagination and adding items to the table.
 * However, most of the configuration can be passed to this object.
 * <p>
 *     In order to use this component, the {@link WineryTableModule} must be imported in the corresponding
 *     module. Afterwards, it can be included in the template by inserting the `<winery-table></winery-table>` tag.
 *     Inputs, which must be passed to the component in order for the table to work, are <code>columns</code> and <code>data</code>.
 *     The <code>columns</code> array must contain objects of type {@link WineryTableColumn}.
 *     The <code>data</code> can be an array of any kind of objects.
 * </p>
 *
 * <label>Inputs</label>
 * <ul>
 *     <li><code>title</code> sets the title for the selector.
 *     </li>
 *     <li><code>data</code> the list of elements the table should display. This field is mandatory!
 *     </li>
 *     <li><code>columns</code> a list of {@link WineryTableColumn} objects. Specifies the column names and
 *         their corresponding objects' property in the <code>data</code> array.
 *     </li>
 *     <li><code>config</code> sets the search configuration. Is of type:
 *     ```
 *     {
 *        paging: boolean;
 *        sorting: {
 *          columns: (Array<WineryTableColumn>|boolean)
 *        };
 *        filtering: {
 *          filterString: string
 *        };
 *        className: [string,string];
 *     }
 *     ```
 *     </li>
 *     <li><code>itemsPerPage</code> Sets how many items per page should be displayed. Default value is 10.
 *     </li>
 *     <li><code>maxSize</code> default value is 5.
 *     </li>
 *     <li><code>numPages</code> default value is 1.
 *     </li>
 *     <li><code>length</code> default value is 0.
 *     </li>
 *     <li><code>disableFiltering</code> If this value is set to true, the search bar will not be included.
 *     </li>
 *     <li><code>filterString</code>
 *     </li>
 *     <li><code>disableButtons</code> default value is `false`.
 *     </li>
 *     <li><code>enableEditButton</code> default value is `false`.
 *     </li>
 *     <li><code>enableIOButton</code> default value is `false`.
 *     </li>
 * </ul>
 *
 * <label>Outputs</label>
 * <ul>
 *     <li><code>cellSelected</code> emits the selected cell in the table. Contains the data of the whole selected row.
 *     </li>
 *     <li><code>removeBtnClicked</code> emits the selected cell in the table. Contains the data of the whole selected row.
 *     </li>
 *     <li><code>addBtnClicked</code> emits the selected cell in the table. Contains the data of the whole selected row.
 *     </li>
 *     <li><code>editBtnClicked</code> emits the selected cell in the table. Contains the data of the whole selected row.
 *     </li>
 *     <li><code>ioBtnClicked</code> emits the selected cell in the table. Contains the data of the whole selected row.
 *     </li>
 *
 * @example <caption>Minimalistic example:</caption>
 * ```
 * ex.component.ts:
 *     dataArray: Array<ExampleData> = [
 *         {
 *             name: 'element name',
 *             condition: 'condition for this value',
 *             example: 'example for using this element'
 *         },
 *         { name: 'second element', condition: 'x < 42', example: 'y = 4' }
 *     ];
 *     columnsArray: Array<WineryTableColumn> = [
 *         { title: 'Name', name: 'name', sort: true },
 *         { title: 'Precondition', name: 'condition', sort: true },
 *         { title: 'Example usage', name: 'example', sort: true },
 *     ]
 *
 * ex.component.html:
 *     <winery-table
 *         [data]="dataArray"
 *         [columns]="columnsArray">
 *     </winery-table>
 * ```
 */
var WineryTableComponent = (function () {
    function WineryTableComponent() {
        this.itemsPerPage = 10;
        this.maxSize = 5;
        this.numPages = 1;
        this.length = 0;
        this.disableFiltering = false;
        this.data = [];
        this.config = {
            /**
             * switch on the paging plugin
             */
            paging: true,
            /**
             * switch on the sorting plugin
             */
            sorting: { columns: this.columns || true },
            /**
             * switch on the filtering plugin
             * {@link ColumnFilter}
             */
            filtering: { filterString: '' },
            /**
             * additional CSS classes that should be added to a table
             */
            className: ['table-striped', 'table-bordered']
        };
        this.disableButtons = false;
        this.enableEditButton = false;
        this.enableIOButton = false;
        this.cellSelected = new core_1.EventEmitter();
        this.removeBtnClicked = new core_1.EventEmitter();
        this.addBtnClicked = new core_1.EventEmitter();
        this.editBtnClicked = new core_1.EventEmitter();
        this.ioBtnClicked = new core_1.EventEmitter();
        this.rows = [];
        this.page = 1;
        this.currentSelected = null;
        this.oldData = this.data;
        this.oldLength = this.oldData.length;
        // this.length = this.data.length;
    }
    // region #######Table events and functions######
    WineryTableComponent.prototype.onChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }
        var filteredData = this.changeFilter(this.data, this.config);
        var sortedData = this.changeSort(filteredData, this.config);
        this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.length = sortedData.length;
    };
    WineryTableComponent.prototype.changePage = function (page, data) {
        if (data === void 0) { data = this.data; }
        var start = (page.page - 1) * page.itemsPerPage;
        var end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    };
    WineryTableComponent.prototype.changeSort = function (data, config) {
        if (!config.sorting) {
            return data;
        }
        var columns = this.config.sorting.columns || [];
        var columnName = void 0;
        var sort = void 0;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }
        if (!columnName) {
            return data;
        }
        // simple sorting
        return data.sort(function (previous, current) {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            }
            else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    };
    WineryTableComponent.prototype.changeFilter = function (data, config) {
        var _this = this;
        var filteredData = data;
        this.columns.forEach(function (column) {
            if (column.filtering) {
                filteredData = filteredData.filter(function (item) {
                    return item[column.name].match(column.filtering.filterString);
                });
            }
        });
        if (!config.filtering) {
            return filteredData;
        }
        if (config.filtering.columnName) {
            return filteredData.filter(function (item) {
                return item[config.filtering.columnName].match(_this.config.filtering.filterString);
            });
        }
        var tempArray = [];
        filteredData.forEach(function (item) {
            var flag = false;
            _this.columns.forEach(function (column) {
                if (!util_1.isNullOrUndefined(item[column.name]) && item[column.name].toString().match(_this.config.filtering.filterString)) {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;
        return filteredData;
    };
    WineryTableComponent.prototype.onCellClick = function (data) {
        this.cellSelected.emit(data);
        this.currentSelected = data.row;
    };
    WineryTableComponent.prototype.onAddClick = function ($event) {
        $event.stopPropagation();
        this.addBtnClicked.emit();
    };
    WineryTableComponent.prototype.onRemoveClick = function ($event) {
        $event.stopPropagation();
        this.removeBtnClicked.emit(this.currentSelected);
    };
    WineryTableComponent.prototype.onEditClick = function ($event) {
        $event.stopPropagation();
        this.editBtnClicked.emit(this.currentSelected);
    };
    WineryTableComponent.prototype.onIOClick = function ($event) {
        $event.stopPropagation();
        this.ioBtnClicked.emit(this.currentSelected);
    };
    WineryTableComponent.prototype.onItemsPerPageChange = function (event, selectElement) {
        event.stopPropagation();
        this.itemsPerPage = selectElement.value;
        this.onChangeTable(this.config);
    };
    WineryTableComponent.prototype.ngOnInit = function () {
        this.config.sorting.columns = this.columns;
        this.length = this.data.length;
        this.onChangeTable(this.config);
    };
    // We "know" that the only way the list can change is
    // identity or in length so that's all we check
    WineryTableComponent.prototype.ngDoCheck = function () {
        if (this.oldData !== this.data) {
            this.oldData = this.data;
            this.oldLength = this.data.length;
            this.onChangeTable(this.config);
        }
        else {
            var newLength = this.data.length;
            var old = this.oldLength;
            if (old !== newLength) {
                // let direction = old < newLength ? 'grew' : 'shrunk';
                // this.logs.push(`heroes ${direction} from ${old} to ${newLength}`);
                this.oldLength = newLength;
                this.onChangeTable(this.config);
            }
        }
    };
    return WineryTableComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], WineryTableComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "itemsPerPage", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "maxSize", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "numPages", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "length", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "disableFiltering", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], WineryTableComponent.prototype, "data", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], WineryTableComponent.prototype, "columns", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], WineryTableComponent.prototype, "filterString", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "config", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "disableButtons", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "enableEditButton", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "enableIOButton", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "cellSelected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "removeBtnClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "addBtnClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "editBtnClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WineryTableComponent.prototype, "ioBtnClicked", void 0);
WineryTableComponent = __decorate([
    core_1.Component({
        selector: 'winery-table',
        templateUrl: 'wineryTable.component.html',
        styleUrls: ['wineryTable.component.css']
    }),
    __metadata("design:paramtypes", [])
], WineryTableComponent);
exports.WineryTableComponent = WineryTableComponent;
//# sourceMappingURL=wineryTable.component.js.map