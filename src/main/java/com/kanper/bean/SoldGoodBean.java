package com.kanper.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "t_sold_good")
@Data
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EntityListeners(AuditingEntityListener.class)
@DynamicUpdate
public class SoldGoodBean implements Serializable {
    public SoldGoodBean(Integer soldNumber, double soldPrice, double discount) {
        this.soldNumber = soldNumber;
        this.soldPrice = soldPrice;
        this.discount = discount;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    /**
     * 商品分类(大类)
     */
    @ManyToOne
    private SecondCategory soldSecondCategory;
    /**
     * 出售数量
     */
    private Integer soldNumber;
    /**
     * 售卖的商品
     */
    @ManyToOne
    private GoodsBean goodsBean;
    /**
     * 商品出售单价
     */
    private double soldPrice;
    /**
     * 商品折扣
     */
    private double discount;
    /**
     * 购买商品的会员
     */
    @ManyToOne
    private MemberBean memberBean;
    /**
     * 商品购买时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @CreatedDate
    @Column(updatable = false)
    private Date buyDate;
    /**
     * 商品购买日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd",timezone = "GMT+8")
    @Column(updatable = false)
    private java.sql.Date date = new java.sql.Date(System.currentTimeMillis());
}
