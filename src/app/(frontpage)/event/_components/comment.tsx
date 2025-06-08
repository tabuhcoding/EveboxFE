"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";


const Comment = () => {
    const t = useTranslations("common");
    
    return (
        <div className="w-full cmt-pad mt-8">
            <h2 className="text-xl md:text-2xl font-bold">
                {t("commentTitle") || "Fallback Text"}
            </h2>

            <div className="card mt-3">
                <div className="card-body">
                    <div className="d-flex flex-start align-items-center">
                        <Image
                            className="rounded-circle shadow-1-strong me-3"
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                            alt="avatar"
                            width={60}
                            height={60}
                            unoptimized
                        />
                        <div>
                            <h6 className="fw-bold mb-1" style={{ color: "#0C4762" }}>Lily Coleman</h6>
                            <p className="text-muted small mb-0">
                                Shared publicly - Jan 2020
                            </p>
                        </div>
                    </div>
                    <p className="mt-3 mb-4 pb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip consequat.
                    </p>
                    <div className="small d-flex justify-content-start">
                        <a href="#!" className="d-flex align-items-center me-3" style={{ textDecoration: "none" }}>
                            <i className="bi bi-hand-thumbs-up mr-2"></i>
                            <p className="mb-0">{t('like')}</p>
                        </a>
                        <a href="#!" className="d-flex align-items-center me-3" style={{ textDecoration: "none" }}>
                            <i className="bi bi-chat-dots mr-2"></i>
                            <p className="mb-0">{t('comment')}</p>
                        </a>
                        <a href="#!" className="d-flex align-items-center me-3" style={{ textDecoration: "none" }}>
                            <i className="bi bi-share-fill mr-2"></i>
                            <p className="mb-0">{t('share')}</p>
                        </a>
                    </div>
                </div>
                <div
                    className="card-footer py-3 border-0"
                    style={{ backgroundColor: "#f8f9fa" }}
                >
                    <div className="d-flex align-items-start w-100">
                        {/* Avatar */}
                        <Image
                            className="rounded-circle shadow-1-strong me-3"
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                            alt="avatar" width={40} height={40}
                            unoptimized
                        />

                        <div className="w-100">
                            <textarea
                                className="form-control mb-2"
                                id="textAreaExample"
                                style={{ background: "#fff", resize: "none", height: "100px" }}
                                placeholder={t('commentHint')}
                                defaultValue={""}
                            />

                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-type-bold me-2" style={{ cursor: "pointer" }}></i>
                                    <i className="bi bi-type-italic me-2" style={{ cursor: "pointer" }}></i>
                                    <i className="bi bi-type-strikethrough me-3" style={{ cursor: "pointer" }}></i>

                                    <label
                                        htmlFor="imageUpload"
                                        className="d-inline-flex align-items-center"
                                        style={{ cursor: "pointer", marginTop: "2px" }}
                                    >
                                        <i className="bi bi-upload"></i>
                                    </label>
                                    <input type="file" id="imageUpload" className="d-none" accept="image/*" />
                                </div>
                                <div className='mt-2'>
                                    <button className="btn-post btn-sm me-2">Post comment</button>
                                    <button className="btn-cancel btn-sm">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Comment;
