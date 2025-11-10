package com.locadora.LocAuto.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locadora.LocAuto.dto.DashboardResumoDTO;
import com.locadora.LocAuto.services.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumo")
    public DashboardResumoDTO getResumoDashboard() {
        return dashboardService.getResumo();
    }
}