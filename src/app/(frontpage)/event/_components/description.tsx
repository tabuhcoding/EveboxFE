'use client';

import { useState } from "react";
import React from "react";
import { useTranslations } from "next-intl";


interface DescriptionProps {
    description: string;
}

export default function Description({ description }: DescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
     const t = useTranslations("common");

    return (
        <div className="flex justify-center mt-8 ml-2">
            <div className="w-full md:w-5/6 bg-gray-100 rounded-lg p-2">
                <h2 className="text-xl md:text-2xl font-bold px-2">{t("desciption") || "Fallback Text"}</h2>
                <div
                    className={`mt-2 overflow-hidden event-description transition-all duration-500 ${isExpanded ? 'max-h-full' : 'max-h-52'}`}
                    style={{ lineHeight: "1.6" }}
                >
                    <div
                        className="prose max-w-none px-2 text-gray-800"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
                <div
                    className="d-flex justify-content-center div-more cursor-pointer mt-2 hover:text-gray-600 bg-transparent"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <i className="bi bi-chevron-up bg-transparent"></i>
                    ) : (
                        <i className="bi bi-chevron-down bg-transparent"></i>
                    )}
                </div>
            </div>
        </div>
    );
}
