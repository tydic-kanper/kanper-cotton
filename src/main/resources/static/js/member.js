$(function () {
    member.initDom();
    member.initEvent();
});
let memberFn = function () {
    return {
        initDom: function () {
            $('#member-soldGoods-table').bootstrapTable({
                url: '/member/queryAllSoldGoodsByMember',
                classes: "table table-hover table-striped table-bordered templatemo-user-table",
                queryParams: function (params) {
                    params.memberId = 1;
                    return params;
                },
                columns: [{
                    field: 'memberBean.memberName',
                    title: '购买者'
                }, {
                    field: 'soldSecondCategory.firstCategory.firstCategoryName',
                    title: '商品分类',
                    sortable: true
                }, {
                    field: 'soldSecondCategory.secondCategoryName',
                    title: '商品名称',
                    sortable: true
                }, {
                    field: 'goodsBean.soldPrice',
                    title: '原价',
                    sortable: true
                }, {
                    field: 'soldPrice',
                    title: '出售价格',
                    sortable: true
                }, {
                    field: 'soldNumber',
                    title: '购买数量',
                    sortable: true
                }, {
                    field: 'discount',
                    title: '折扣'
                }, {
                    field: 'buyDate',
                    title: '购买时间',
                    sortable: true
                }],
                search: true,
                showRefresh: true,
                showFullscreen: true,
                showToggle: true,
                showExport: true,
                showPaginationSwitch: true,
                showColumns: true,
                pagination: true,
                cache: false
            });
            $('#member-table').bootstrapTable({
                uniqueId: 'id',
                url: '/member/getAllMember',
                classes: "table table-hover table-striped table-bordered templatemo-user-table",
                columns: [{
                    field: 'id',
                    title: '会员ID'
                }, {
                    field: 'memberName',
                    title: '会员名称',
                    sortable: true
                }, {
                    field: 'phone',
                    title: '会员手机',
                    sortable: true
                }, {
                    field: 'integral',
                    title: '会员积分',
                    sortable: true
                }, {
                    field: 'birthday',
                    title: '会员生日',
                    sortable: true
                }, {
                    field: 'createDate',
                    title: '会员创建时间',
                    sortable: true
                }, {
                    field: 'query',
                    title: '购物记录',
                    formatter: function (value, row) {
                        return "<button type='button' class='btn btn-xs btn-success' data-id='" + row.id + "'>购物记录</button>";
                    }
                }, {
                    field: 'function',
                    title: '操作',
                    formatter: function (value, row) {
                        return "<button type='button' class='btn btn-xs btn-danger' data-id='" + row.id + "'>删除</button><button type='button' class='btn btn-xs btn-info' data-id='" + row.id + "'>修改积分</button>";
                    }
                }],
                search: true,
                showRefresh: true,
                showFullscreen: true,
                showToggle: true,
                showExport: true,
                showPaginationSwitch: true,
                showColumns: true,
                pagination: true,
                cache: false,
                onDblClickRow: function (row) {

                    $('#updatemyModalLabel').html("修改会员==>" + row.memberName);
                    $('#update-member-name').val(row.memberName);
                    $('#update-member-id').val(row.id);
                    $('#update-member-phone').val(row.phone);
                    $('#update-member-birth').val(row.birthday);
                    $('#update-member-integral').val(row.integral);

                    $('#update-member').modal('show');
                }
            });
        },
        initEvent: function () {
            $('#member-table').on('click', "button.btn-success", function () {
                let memberId = $(this).attr('data-id');
                $('#member-soldGoods-table').bootstrapTable('refresh', {query: {memberId: memberId}});
                $('#member-soldGoods').modal('show');
            });
            $('#member-table').on('click', "button.btn-danger", function () {
                let memberId = $(this).attr('data-id');
                $.ajax({
                    url: '/member/delMember',
                    data: {memberId: memberId},
                    method: 'post',
                    success: function (data) {
                        if (data.code == 0) {
                            $("#member-table").bootstrapTable('refresh');
                            toastr.success(data.msg);
                        } else {
                            toastr.error(data.msg);
                        }
                    },
                    error: function (e) {
                        if (e.status == 401) {
                            toastr.error('你必须具备管理员权限才能进行操作');
                            return;
                        }
                        toastr.error(e.responseJSON.msg);
                    }
                });
            });
            $('#member-table').on('click', "button.btn-info", function () {
                let memberId = $(this).attr('data-id');
                console.log(memberId);
                let row = $('#member-table').bootstrapTable('getRowByUniqueId', memberId);
                $('#updatemyModalLabel').html("修改会员==>" + row.memberName);
                $('#update-member-name').val(row.memberName);
                $('#update-member-id').val(row.id);
                $('#update-member-phone').val(row.phone);
                $('#update-member-birth').val(row.birthday);
                $('#update-member-integral').val(row.integral);

                $('#update-member').modal('show');
            });
            $('#update-member-form').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    integral: {
                        validators: {
                            notEmpty: {},
                            greaterThan: {
                                value: 0,
                                inclusive: false,
                                message: '积分不能低于0'
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
                    url: '/member/updateMember',
                    data: $form.serialize(),
                    method: 'post',
                    success: function (data) {
                        if (data.code == 0) {
                            $('#update-member').modal('hide');
                            $('#member-table').bootstrapTable('refresh');
                            toastr.success(data.msg);
                        } else {
                            toastr.error(data.msg);
                        }
                        $('#update-member-form').bootstrapValidator('resetForm', true);

                    },
                    error: function (e) {
                        $('#update-member-form').bootstrapValidator('resetForm', true);
                        if (e.status == 401) {
                            toastr.error('你必须具备管理员权限才能进行操作');
                            return;
                        }
                        toastr.error(e.responseJSON.message);
                    }
                });
            });
            $('#add-member-form').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    memberName: {
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
                    },
                    birthday: {
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
                    url: '/member/addMember',
                    data: $form.serialize(),
                    method: 'post',
                    success: function (data) {
                        if (data.code == 0) {
                            $('#add-member').modal('hide');
                            $('#member-table').bootstrapTable('refresh');
                            toastr.success(data.msg);
                        } else {
                            toastr.error(data.msg);
                        }
                        $('#add-member-form').bootstrapValidator('resetForm', true);

                    },
                    error: function (e) {
                        $('#add-member-form').bootstrapValidator('resetForm', true);
                        toastr.error(e.responseJSON.message);
                    }
                });
            });
        }
    }
};
let member = memberFn();