"use client";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import 'datatables.net-responsive-dt';
import { useEffect } from "react";
export const TableData = (tableId, dataset = []) => {
    // console.log("postdata:", dataset)
    const table = new DataTable(`#${tableId}`, {
        responsive: true,
        paging: true,
        searching: false,
        data: dataset,
        columns: [
            {
                data: "ID",
                class: "w-10px pe-2 sorting_disabled",
                title: `<div class="form-check form-check-sm form-check-custom form-check-solid me-3">
          <input class="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_customers_table .form-check-input" value="">
        </div>`,
            },

            { data: "PostTitle", title: "Post Title" },
            { data: "post_cat", title: "Category" },
            { data: "PostThumb", title: "Post Image" },

            { data: "post_views", title: "Total Views" }, // maybe won't be shown
            { data: "date", title: "Date" }, // maybe won't be shown
            { data: "UserName", title: "Author" },
            { data: "action", title: "Action" }, // maybe won't be shown
        ],
        columnDefs: [
            {
                targets: 0,
                orderable: false,
                render: function (data) {
                    return `
                    <div class="form-check form-check-sm form-check-custom form-check-solid">
                        <input class="form-check-input" type="checkbox" value="${data}" />
                    </div>`;
                }
            },
            {
                targets: 3,
                render: function (data, type, row) {
                    return `<img src="https://i4.ytimg.com/vi/ofI2pMj36kA/hqdefault.jpg" class="w-35px me-3" alt="${row.CreditCardType}">` + data;
                }
            },
            {
                targets: 7,
                data: null,
                orderable: false,
                className: 'text-end',
                render: function (data, type, row) {
                    return `
                    <a href="#" className="btn btn-light btn-active-light-primary btn-sm" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                        Actions
                        <span className="svg-icon svg-icon-5 m-0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                    <path d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999)"></path>
                                </g>
                            </svg>
                        </span>
                    </a>
                    <!--begin::Menu-->
                    <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
                        <!--begin::Menu item-->
                        <div className="menu-item px-3">
                            <a href="#" className="menu-link px-3" data-kt-customer-table-filter="edit_row">
                                Edit
                            </a>
                        </div>
                        <!--end::Menu item-->
  
                        <!--begin::Menu item-->
                        <div className="menu-item px-3">
                            <a href="#" className="menu-link px-3" data-kt-customer-table-filter="delete_row">
                                Delete
                            </a>
                        </div>
                        <!--end::Menu item-->
                    </div>
                    <!--end::Menu-->
                `;
                },
            },
        ]
    });
    table.destroy();
    return table;
}
export default function JqueryDatatable() {
    const postdata = [
        {
            "ID": "42",
            "PostTitle": "Lemonade Stand for Rent",
            "post_cat": "Fundings and exits",
            "PostThumb": "\/\/techmind.in\/featured\/2024\/01\/IMG_9826-1024x768.jpg",
            "post_views": "0",
            "Affiliate": "",
            "UserName": "Adesh ",
            "date": "19\/01\/2024",
            "action": ''
        },
        {
            "ID": "41",
            "PostTitle": "Why \u2018Fairness\u2019 Matters in Techno-Optimism, How To Successfully Take Time Off Between Jobs, and Why ChatGPT Changes the Lives of Indie Developers [linkblog]",
            "post_cat": "Fundings and exits",
            "PostThumb": "\/\/techmind.in\/featured\/2024\/01\/DALL\u00b7E-2023-11-14-12.41.26.png",
            "post_views": "0",
            "Affiliate": "",
            "UserName": "Adesh ",
            "date": "19\/01\/2024",
            "action": ''
        },
        {
            "ID": "40",
            "PostTitle": "Greenhouse CEO Daniel Chait on how AI is changing human resources and weaning his company off venture funding via private equity",
            "post_cat": "Fundings and exits",
            "PostThumb": "\/\/techmind.in\/featured\/2024\/01\/Screenshot-2023-12-11-at-6.15.04\u202fAM.png",
            "post_views": "0",
            "Affiliate": "",
            "UserName": "",
            "date": "19\/01\/2024",
            "action": ''
        },
        {
            "ID": "39",
            "PostTitle": "2024\u2019s First Link Blog Post (Because Happy Birthday Matt Mullenweg)",
            "post_cat": "Fundings and exits",
            "PostThumb": "\/\/techmind.in\/featured\/2024\/01\/DALL\u00b7E-2024-01-03-17.19.02-a-monkey-eating-a-birthday-cake-digital-art.png",
            "post_views": "0",
            "Affiliate": "",
            "UserName": "",
            "date": "19\/01\/2024",
            "action": ''
        },
        {
            "ID": "38",
            "PostTitle": "\u201cIt takes a year to find great executives so you must always look down the field.\u201d Proof\u2019s Pat Kinsel on why he believes a VCs most critical task is to make sure the WRONG person doesn\u2019t get hired into a startup.",
            "post_cat": "Fundings and exits",
            "PostThumb": "\/\/techmind.in\/featured\/2024\/01\/Screenshot-2024-01-12-at-5.36.58\u202fPM.png",
            "post_views": "0",
            "Affiliate": "",
            "UserName": "",
            "date": "19\/01\/2024",
            "action": ''
        },
        {
            "ID": "37",
            "PostTitle": "The Art of Companion Planting: Vegetable Garden Design Tips",
            "post_cat": "Video news",
            "PostThumb": "\/\/techmind.in\/featured\/2023\/06\/fenty-beauty-fu-y-gloss-bomb-1543927447.jpg",
            "post_views": "0",
            "Affiliate": "1",
            "UserName": "",
            "date": "08\/06\/2023",
            "action": ''
        },
        {
            "ID": "36",
            "PostTitle": "7 Smart Ways You Can Use TBT To Grow Your Brand on Social",
            "post_cat": "Social",
            "PostThumb": "\/\/techmind.inhttp:\/\/192.168.5.234\/blogs\/uploads\/featured\/1970\/01\/telecommunication.png",
            "post_views": "0",
            "Affiliate": "0",
            "UserName": "Adesh ",
            "date": "23\/02\/2023",
            "action": ''
        },
        {
            "ID": "35",
            "PostTitle": "Top Influencers in 2023: Who to Watch and Why They\u2019re Great",
            "post_cat": "Social",
            "PostThumb": "\/\/techmind.inhttps:\/\/s.w.org\/images\/core\/emoji\/14.0.0\/72x72\/2728.png",
            "post_views": "0",
            "Affiliate": "0",
            "UserName": "Adesh ",
            "date": "23\/02\/2023",
            "action": ''
        },
        {
            "ID": "34",
            "PostTitle": "The 12 Top Benefits of Chatbots in 2023",
            "post_cat": "Social",
            "PostThumb": "\/\/techmind.inhttps:\/\/blog.hootsuite.com\/wp-content\/uploads\/2023\/02\/image2-1-620x596.png",
            "post_views": "0",
            "Affiliate": "0",
            "UserName": "Adesh ",
            "date": "23\/02\/2023",
            "action": ''
        },
        {
            "ID": "33",
            "PostTitle": "2023 Guide to Social Media Competitor Analysis [Free Template]",
            "post_cat": "Social",
            "PostThumb": "\/\/techmind.inhttps:\/\/blog.hootsuite.com\/wp-content\/uploads\/2024\/05\/1-social-media-competitive-analysis-620x253.png",
            "post_views": "0",
            "Affiliate": "0",
            "UserName": "",
            "date": "23\/02\/2023",
            "action": ''
        }
    ];
    useEffect(() => {
        TableData('myTable', postdata);
    }, [postdata]);

    return (<table id="myTable" className="display"></table>)
}