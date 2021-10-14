package com.globits.healthdeclaration.domain;

import com.globits.core.domain.BaseObject;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "tbl_health_org")
@XmlRootElement
public class HealthOrganization extends BaseObject {

    private static final long serialVersionUID = 1L;

    @Column(name="name")
    private String name;

    @Column(name="code",nullable = false,unique = true)
    private String code;

    @ManyToOne
    @JoinColumn(name = "administrative_unit_id")
    @NotFound(action = NotFoundAction.IGNORE)
    private HDAdministrativeUnit administrativeUnit;// đơn vị hành chính

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public HDAdministrativeUnit getAdministrativeUnit() {
        return administrativeUnit;
    }

    public void setAdministrativeUnit(HDAdministrativeUnit administrativeUnit) {
        this.administrativeUnit = administrativeUnit;
    }
}
