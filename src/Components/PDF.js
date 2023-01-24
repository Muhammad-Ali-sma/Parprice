import { View, Text } from "react-native";
import React from "react";
import { demoImgUrl, imgUrl, pdfHost } from "../Utils/Host";
import { useSelector } from "react-redux";
import { ctf } from "../Utils/GlobalFunc";

const PDF = (temp, quote, user, company) => {

    return `
    <html>
       <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                <link rel="stylesheet" href="${pdfHost}/assets/css/backend-plugin.min.css">
                <link rel="stylesheet" href="${pdfHost}/assets/css/backend.css?v=1.0.0">
                <style>
                    body{
                        padding: 10px;
                    }
                    .wrapper-container {
                        width: 100%;
                        background-color: #fff;
                        box-shadow: 0 0.0625rem 0.25rem rgb(0 0 0 / 10%), 0 0.25rem 0.75rem rgb(0 0 0 / 5%);
                        border: 1px solid #e1e1e1;
                        border-radius: 0.125rem;
                        padding: 0;
                    }

                    .grey-line {
                        background-color: #657884;
                        padding: 6px;
                    }

                    .approve {
                        background-color: #ecf3db;
                        color: #517209;
                        border-radius: 4px;
                        float: right;
                        font-size: 12px;
                        padding-left: 15px;
                        padding-right: 15px;
                        padding-top: 5px;
                        padding-bottom: 5px;
                    }

                    .white-column {
                        background-color: white;
                        display: flex;
                        justify-content: space-between;
                        padding-top: 30px;
                    }

                    .prod-head {
                        border-bottom: 1px solid black;
                        margin-left: 0;
                        margin-right: 0;
                    }

                    .border-row-grey {
                        border-bottom: 1px solid #e3e3e3;
                        margin-left: 0;
                        margin-right: 0;
                        padding-top: 10px;
                        padding-bottom: 30px;

                    }

                    .border-row-grey:nth-child(4) {
                        border-bottom: 4px solid #e3e3e3 !important;
                    }

                    .go-right {
                        float: right;
                    }

                    .last-col {
                        display: flex;
                        align-items: flex-end;
                        justify-content: space-between;
                    }

                    .group-col {
                        display: flex;
                        justify-content: space-between;
                        padding-right: 20%;
                    }

                    ul li {
                        border-bottom: 1px solid #e3e3e3;
                        margin-bottom: 5px;
                        padding-bottom: 8px;
                    }

                    ul li:last-child {
                        border-bottom: 4px solid #e3e3e3 !important;
                    }
                    .res-text{
                        display: none;
                    }
                    .grey-border-right{
                        border-left: 1px solid #e3e3e3;
                    }
                    @media only screen and (max-width: 768px) {
                        .grey-row{
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                        }
                        .group-col{
                            padding: 0;
                        }
                        .btn-primary{
                            width: 100%;
                        }
                        .prod-head {
                            display: none;
                        }

                        .hidden-text {
                            display: none;
                        }
                        .white-column{
                            justify-content: center;
                            gap: 50%;
                        }
                        .border-row-grey{
                            border: none;
                            padding-bottom: 0;
                        }
                        .last-col{
                            border-top: 1px solid #e3e3e3;
                            border-bottom: 1px solid #e3e3e3;
                        }
                        .res-text{
                            display: block;
                            font-size: 12px;
                            margin-bottom: 1px;
                        }
                        .col-set-1{
                            width: 27%;
                            text-align: end;
                        }
                        .col-set-2{
                            width: 40%;
                            text-align: end;
                            border-left: 1px solid #e3e3e3;
                            border-right: 1px solid #e3e3e3;
                            padding-right: 15px;
                            padding-top: 10px;
                        }
                        ul li:first-child {
                            border-top: 4px solid #e3e3e3 !important;
                            padding-top: 20px;
                        }
                        .grey-border-right{
                            border:none;
                        }
                        
                        
                    }
                </style>
       </head>
       <body>
       <div class="wrapper">
       <div class="container p-0">
           <div class="row">
               <div class="col-md-12 text-center pb-3"><img src="${imgUrl}${company?.thumb}" style="width: 140px;">
               <br><h5>${company?.name}</h5>
       </div>
       <div class="container wrapper-container">
           <div class="grey-line"></div>
           <div class="container-fluid">
               <div class="row pt-5 grey-row px-4" style="background-color:#f4f4f4;">
                   <div class="col-sm-6">
                       <p>Estimate #${quote?.jobId}</p>
                   </div>
                   <div class="col-sm-6 px-0">
                       <p class="approve">APPROVED</p>
                   </div>
                   <div class="col-sm-12 col-md-7 pb-3">
                       <span class="font-weight-bold">${quote?.client?.firstname} ${quote?.client?.lastname}</span><br>
                       <span>${quote?.client?.address}</span><br>
                        <span>${'(' + quote?.client?.phonenumber?.substring(0, 3) + ") " + quote?.client?.phonenumber?.substring(3, 6) + "-" + quote?.client?.phonenumber?.substring(6, quote?.client?.phonenumber?.length)}</span>
                   </div>
                   <div class="col-sm-12 col-md-5 white-column">
                       <p>Sent on</p>
                       <p>${quote?.startDate}</p>
                   </div>
               </div>
           </div>
           <div class="container-fluid mt-4 px-4">
               <div class="row prod-head">
                   <div class="col-md-6">
                       <p class="font-weight-bold">PRODUCT / SERVICE</p>
                   </div>
                   <div class="col-md-2 text-right">
                       <p class="font-weight-bold">QTY.</p>
                   </div>
                   <div class="col-md-2 text-right">
                       <p class="font-weight-bold">UNIT PRICE</p>
                   </div>
                   <div class="col-md-2 text-right">
                       <p class="font-weight-bold">DISCOUNT</p>
                   </div>
               </div>
               ${quote?.cart?.map((item) => (
                      `<div class="row border-row-grey">
                           <div class="col-md-8 group-col">
                               <div>
                                   <span class="font-weight-bold">${item.title}</span>
                                   <br>${item?.catname ?? ""}
                               </div>

                               <div><img src="${(item.demoProd == 0  ? imgUrl : demoImgUrl) + item.thumb}" style="height:50px;"></div>
                           </div>
                           <div class="col-md-4 last-col">
                               <div class="col-set-1">
                                   <p class="font-weight-bold res-text">QTY.</p>
                                   <p>$${item.quantity}</p>
                               </div>
                               
                               <div class="col-set-2">
                                   <p class="font-weight-bold res-text">UNIT PRICE</p>
                                   <p>$${ctf(item.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                               </div>
                               
                               <div class="col-set-1">
                                   <p class="font-weight-bold res-text">DISCOUNT</p>
                                   <p>$${ctf(quote?.manualDiscount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                               </div>
                               
                           </div>
                       </div>`
               ))}

               <div class="row">
                   <div class="col-md-7 pt-3 hidden-text">
                       <p>This quote is valid for the next 30 days, after which values may be subject to change.</p>
                   </div>
                   <div class="col-sm-12 col-md-5 pt-3 mb-3 grey-border-right">
                       <ul style="padding-left:0px; list-style:none; margin:0;">
                           <li><span>Subtotal</span><span class="go-right">$${temp.subtotal}</span></li>
                           <li><span>Discount</span><span class="go-right">$${ctf(quote?.manualDiscount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></li>
                           <li><span>Deposit</span><span class="go-right">$${ctf(quote?.deposit).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></li>
                           <li><span>Total</span><span class="go-right">$${ctf(temp.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></li>
                       </ul>
                   </div>
               </div>
           </div>
       </div>
   </div>
       </body>
    </html>
    `
};
{/* <li><span>Current Offer</span><span class="go-right">$${temp.discount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></li> */}

export default PDF;
