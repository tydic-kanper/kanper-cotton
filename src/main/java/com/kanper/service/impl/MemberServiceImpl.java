package com.kanper.service.impl;

import com.kanper.bean.MemberBean;
import com.kanper.common.Response;
import com.kanper.repository.IMemberRepository;
import com.kanper.service.IMemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class MemberServiceImpl implements IMemberService {
    @Autowired
    private IMemberRepository memberRepository;

    @Override
    public List<MemberBean> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public Response<String> addMember(MemberBean memberBean) {
        MemberBean memberBean1 = memberRepository.save(memberBean);
        if (memberBean1 != null) {
            return Response.ok("会员" + memberBean.getMemberName() + "添加成功");
        }
        return Response.fail("添加失败", "会员" + memberBean.getMemberName() + "添加失败");
    }

    @Override
    public Response<String> delMember(Long memberId) {
        try {
            memberRepository.delete(memberId);
            return Response.ok("会员删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail(e.getMessage());
        }

    }

    @Override
    public Response<String> updateMember(MemberBean memberBean) {
        try {
            memberRepository.save(memberBean);
            return Response.ok("会员" + memberBean.getMemberName() + "修改成功");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Response.fail("修改失败", "会员" + memberBean.getMemberName() + "修改失败");
    }
}