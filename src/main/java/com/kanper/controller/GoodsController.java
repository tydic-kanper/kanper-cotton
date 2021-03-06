package com.kanper.controller;

import com.kanper.annotation.Authorization;
import com.kanper.bean.GoodsBean;
import com.kanper.common.ActionResult;
import com.kanper.common.Response;
import com.kanper.service.IGoodsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/goods")
@Slf4j
public class GoodsController {
    @Autowired
    private IGoodsService goodsService;

    @PostMapping("/batchAdd")
    @Authorization
    public ActionResult batchAdd(@RequestBody GoodsBean[] goodsBeans) {
        List<GoodsBean> rest = goodsService.addBatch(Arrays.asList(goodsBeans));
        if (!rest.isEmpty()) {
            return ActionResult.success("批量添加商品成功", rest);
        }
        return ActionResult.fail("批量添加商品失败");
    }

    @GetMapping("/getAllGoods")
    public List<GoodsBean> getAllGoods() {
        return goodsService.getAllGoods();
    }

    @PostMapping("/updateGoods")
    @Authorization
    public ActionResult updateGoods(GoodsBean goodsBean) {
        GoodsBean goodsBean1 = goodsService.updateGoods(goodsBean);
        if (goodsBean1 != null) {
            return ActionResult.success("商品记录" + goodsBean1.getSecondCategory().getSecondCategoryName() + "修改成功", goodsBean1);
        }
        return ActionResult.fail("商品记录" + goodsBean1.getSecondCategory().getSecondCategoryName() + "修改失败");
    }

    @GetMapping("/getAllGoodsBySecondCategoryId")
    public List<GoodsBean> getAllGoodsBySecondCategoryId(Long secondCategoryId, Long firstCategoryId) {
        if (null == secondCategoryId && firstCategoryId == null) {
            return goodsService.getAllGoods();
        } else if (null == secondCategoryId) {
            return goodsService.getAllGoodsByFirstCategoryId(firstCategoryId);
        } else {
            return goodsService.getAllGoodsBySecondCategoryId(secondCategoryId);
        }
    }

    @PostMapping("/deleteGoods")
    public ActionResult deleteGoods(Long goodsId) {
        Response<String> response = goodsService.deleteGoods(goodsId);
        if (response.isOk()) {
            return ActionResult.success("商品返货成功");
        }
        return ActionResult.fail(response.getErrorMessage());
    }

}
