;
$(function () {
    backend.initEvent();
});
let backendFn = function () {
    return {
        initDom: function () {

        },
        initEvent: function () {
            $('#add-product-row').on('click', function () {
                let $row = $('#add-product-batch tr').last();
                let $supplier = $row.find('select.supplier');
                let $good = $row.find('select.secondCategory').eq(0);
                let $tr = "<tr class='product-add-row'>";
                $tr += "<td class=\"col-xs-1\"><select name=\"supplier.id\"  class=\"form-control supplier\" data-live-search=\"true\" data-size=\"5\">" + $supplier.html() + "</select></td><td class=\"col-xs-1\"><select name=\"secondCategory.id\" class=\"form-control secondCategory\" data-live-search=\"true\" data-size=\"5\">" + $good.html() + "</select></td><td class=\"col-xs-1\"><input name=\"buyPrice\" type=\"number\" class=\"form-control input-sm\"></td><td class=\"col-xs-1\"><input name=\"soldPrice\" type=\"number\" class=\"form-control input-sm\"></td><td class=\"col-xs-1\"><input name=\"number\" type=\"number\" class=\"form-control input-sm\" value=\"1\"></td></tr>";
                $('#add-product-batch').append($tr);
                $('#add-product-batch tr').last().find('select').selectpicker('refresh');

            });
            $('#add-product-form').bootstrapValidator().on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                // Get the form instance
                let form = utils.serializeTable($('#add-product-batch'));
                console.log(form);
                $.ajax({
                    url: '/goods/batchAdd',
                    data: JSON.stringify(form),
                    dataType: "json",
                    contentType: 'application/json',
                    method: 'post',
                    success: function (data) {
                        $('#add-product-frame').modal('hide');
                        $('#add-product-form')[0].reset();
                        if (data.code == 0) {
                            toastr.success(data.msg);
                            $('#add-product-batch tr').remove('.product-add-row');
                        }
                    },
                    error: function (e) {
                        toastr.error(e.responseJSON.msg);
                    }
                });
            });
            // 添加供应商
            $('#add-supplier').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    supplierName: {
                        validators: {
                            notEmpty: {}
                        }
                    },
                    phone: {
                        validators: {
                            notEmpty: {},
                            phone: {
                                country: 'CN'
                            }
                        }
                    }
                }
            }).on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                // Get the form instance
                let $form = $(e.target);
                $.ajax({
                    url: '/supplier/add',
                    data: $form.serialize(),
                    method: 'post',
                    success: function (data) {
                        $('#add-supplier-frame').modal('hide');
                        $('#add-supplier').bootstrapValidator('resetForm', true);
                        toastr.success(data.msg);
                    },
                    error: function (e) {
                        toastr.error(e.responseJSON.msg);
                    }
                });
            });
            // 添加商品
            $('#add-goods').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    id: {
                        validators: {
                            notEmpty: {}
                        }
                    },
                    secondCategoryName: {
                        validators: {
                            notEmpty: {}
                        }
                    }
                }
            }).on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                // Get the form instance
                let $form = $(e.target);
                $.ajax({
                    url: '/secondCategory/add',
                    data: $form.serialize(),
                    method: 'post',
                    success: function (data) {
                        $('#add-goods-frame').modal('hide');
                        $('#add-goods').bootstrapValidator('resetForm', true);
                        toastr.success(data.msg);
                    },
                    error: function (e) {
                        toastr.error(e.responseJSON.msg);
                    }
                });
            });
            // 添加分类
            $('#addSort').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    firstCategoryName: {
                        validators: {
                            notEmpty: {}
                        }
                    }
                }
            }).on('success.form.bv', function (e) {
                // Prevent form submission
                e.preventDefault();
                // Get the form instance
                let $form = $(e.target);
                $.ajax({
                    url: '/firstCategory/add',
                    data: $form.serialize(),
                    method: 'post',
                    success: function (data) {
                        $('#add-category-frame').modal('hide');
                        $('#addSort').bootstrapValidator('resetForm', true);
                        toastr.success(data.msg);
                    },
                    error: function (e) {
                        toastr.error(e.responseJSON.msg);
                    }
                });
            });
            $('#add-goods-frame').on('show.bs.modal', function () {
                $.ajax({
                    url: '/firstCategory/getAllCategory',
                    success: function (data) {
                        let options = '';
                        if (data && data.length != 0) {
                            for (const datum of data) {
                                options += '<option value=\'' + datum.id + '\'>' + datum.firstCategoryName + '</option>';
                            }
                            $('#category-select').html(options).selectpicker('refresh');
                        }
                    }
                })
            });
            $('#all-category-frame').on('show.bs.modal', function () {
                $('#all-category-table').bootstrapTable({
                    classes: "table table-hover table-striped table-bordered templatemo-user-table",
                    columns: [{
                        field: 'id',
                        title: '分类ID'
                    }, {
                        field: 'firstCategoryName',
                        title: '分类名称'
                    }],
                    cache: false,
                    url: '/firstCategory/getAllCategory'
                });
            });
            $('#all-goods-frame').on('show.bs.modal', function () {
                $('#all-goods-table').bootstrapTable({
                    classes: "table table-hover table-striped table-bordered templatemo-user-table",
                    columns: [{
                        field: 'id',
                        title: '商品ID'
                    }, {
                        field: 'secondCategoryName',
                        title: '商品名称'
                    }, {
                        field: 'firstCategory.firstCategoryName',
                        title: '分类名称'
                    }],
                    pagination: true,
                    cache: false,
                    url: '/secondCategory/getAllGoods'
                });
            });
            $('#all-supplier-frame').on('show.bs.modal', function () {
                $('#all-suppliers-table').bootstrapTable({
                    classes: "table table-hover table-striped table-bordered templatemo-user-table",
                    columns: [{
                        field: 'id',
                        title: '供应商ID'
                    }, {
                        field: 'supplierName',
                        title: '供应商名称'
                    }, {
                        field: 'phone',
                        title: '供应商电话'
                    }],
                    pagination: true,
                    cache: false,
                    url: '/supplier/allSuppliers'
                });
            });
            $('#add-product-frame').on('show.bs.modal', function () {
                $.ajax({
                    url: '/secondCategory/getAllGoods',
                    success: function (data) {
                        let options = '';
                        if (data && data.length != 0) {
                            for (const datum of data) {
                                options += '<option value=\'' + datum.id + '\'>' + datum.secondCategoryName + '</option>';
                            }
                            $('#add-product-batch select[name=\'secondCategory.id\']').html(options).selectpicker('refresh');
                        }
                    }
                });
                $.ajax({
                    url: '/supplier/allSuppliers',
                    success: function (data) {
                        let options = '';
                        if (data && data.length != 0) {
                            for (const datum of data) {
                                options += '<option value=\'' + datum.id + '\'>' + datum.supplierName + '</option>';
                            }
                            $('#add-product-batch select[name=\'supplier.id\']').html(options).selectpicker('refresh');
                        }
                    }
                });
            });
        }
    }
};
let backend = backendFn();