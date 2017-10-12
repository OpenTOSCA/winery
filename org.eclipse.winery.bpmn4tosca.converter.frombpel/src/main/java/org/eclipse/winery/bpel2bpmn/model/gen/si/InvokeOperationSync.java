/*
 * *****************************************************************************
 * Copyright (c) 2015-2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Alex Frank - initial API and implementation
 * *****************************************************************************
 *
 */

//
// Diese Datei wurde mit der JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.8-b130911.1802 generiert
// Siehe <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a>
// Änderungen an dieser Datei gehen bei einer Neukompilierung des Quellschemas verloren.
// Generiert: 2017.07.24 um 11:12:17 PM CEST
//


package org.eclipse.winery.bpel2bpmn.model.gen.si;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java-Klasse für invokeOperationSync complex type.
 * <p>
 * <p>Das folgende Schemafragment gibt den erwarteten Content an, der in dieser Klasse enthalten ist.
 * <p>
 * <pre>
 * &lt;complexType name="invokeOperationSync">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="CsarID" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ServiceInstanceID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="NodeInstanceID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ServiceTemplateIDNamespaceURI" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ServiceTemplateIDLocalPart" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="NodeTemplateID" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="InterfaceName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="OperationName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;choice>
 *           &lt;element name="Params" type="{http://siserver.org/schema}ParamsMap" minOccurs="0"/>
 *           &lt;element name="Doc" type="{http://siserver.org/schema}Doc" minOccurs="0"/>
 *         &lt;/choice>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "invokeOperationSync", propOrder = {
    "csarID",
    "serviceInstanceID",
    "nodeInstanceID",
    "serviceTemplateIDNamespaceURI",
    "serviceTemplateIDLocalPart",
    "nodeTemplateID",
    "interfaceName",
    "operationName",
    "params",
    "doc"
})
public class InvokeOperationSync {

    @XmlElement(name = "CsarID", required = true)
    protected String csarID;
    @XmlElement(name = "ServiceInstanceID")
    protected String serviceInstanceID;
    @XmlElement(name = "NodeInstanceID")
    protected String nodeInstanceID;
    @XmlElement(name = "ServiceTemplateIDNamespaceURI", required = true)
    protected String serviceTemplateIDNamespaceURI;
    @XmlElement(name = "ServiceTemplateIDLocalPart", required = true)
    protected String serviceTemplateIDLocalPart;
    @XmlElement(name = "NodeTemplateID", required = true)
    protected String nodeTemplateID;
    @XmlElement(name = "InterfaceName")
    protected String interfaceName;
    @XmlElement(name = "OperationName", required = true)
    protected String operationName;
    @XmlElement(name = "Params")
    protected ParamsMap params;
    @XmlElement(name = "Doc")
    protected Doc doc;

    /**
     * Ruft den Wert der csarID-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getCsarID() {
        return csarID;
    }

    /**
     * Legt den Wert der csarID-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setCsarID(String value) {
        this.csarID = value;
    }

    /**
     * Ruft den Wert der serviceInstanceID-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getServiceInstanceID() {
        return serviceInstanceID;
    }

    /**
     * Legt den Wert der serviceInstanceID-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setServiceInstanceID(String value) {
        this.serviceInstanceID = value;
    }

    /**
     * Ruft den Wert der nodeInstanceID-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getNodeInstanceID() {
        return nodeInstanceID;
    }

    /**
     * Legt den Wert der nodeInstanceID-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setNodeInstanceID(String value) {
        this.nodeInstanceID = value;
    }

    /**
     * Ruft den Wert der serviceTemplateIDNamespaceURI-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getServiceTemplateIDNamespaceURI() {
        return serviceTemplateIDNamespaceURI;
    }

    /**
     * Legt den Wert der serviceTemplateIDNamespaceURI-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setServiceTemplateIDNamespaceURI(String value) {
        this.serviceTemplateIDNamespaceURI = value;
    }

    /**
     * Ruft den Wert der serviceTemplateIDLocalPart-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getServiceTemplateIDLocalPart() {
        return serviceTemplateIDLocalPart;
    }

    /**
     * Legt den Wert der serviceTemplateIDLocalPart-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setServiceTemplateIDLocalPart(String value) {
        this.serviceTemplateIDLocalPart = value;
    }

    /**
     * Ruft den Wert der nodeTemplateID-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getNodeTemplateID() {
        return nodeTemplateID;
    }

    /**
     * Legt den Wert der nodeTemplateID-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setNodeTemplateID(String value) {
        this.nodeTemplateID = value;
    }

    /**
     * Ruft den Wert der interfaceName-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getInterfaceName() {
        return interfaceName;
    }

    /**
     * Legt den Wert der interfaceName-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setInterfaceName(String value) {
        this.interfaceName = value;
    }

    /**
     * Ruft den Wert der operationName-Eigenschaft ab.
     *
     * @return possible object is
     * {@link String }
     */
    public String getOperationName() {
        return operationName;
    }

    /**
     * Legt den Wert der operationName-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setOperationName(String value) {
        this.operationName = value;
    }

    /**
     * Ruft den Wert der params-Eigenschaft ab.
     *
     * @return possible object is
     * {@link ParamsMap }
     */
    public ParamsMap getParams() {
        return params;
    }

    /**
     * Legt den Wert der params-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link ParamsMap }
     */
    public void setParams(ParamsMap value) {
        this.params = value;
    }

    /**
     * Ruft den Wert der doc-Eigenschaft ab.
     *
     * @return possible object is
     * {@link Doc }
     */
    public Doc getDoc() {
        return doc;
    }

    /**
     * Legt den Wert der doc-Eigenschaft fest.
     *
     * @param value allowed object is
     *              {@link Doc }
     */
    public void setDoc(Doc value) {
        this.doc = value;
    }

}
