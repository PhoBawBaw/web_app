'use client';

import React from "react";
import Link from 'next/link';

const StartScreen: React.FC = () => {
    return (
        <div className="sign-up">
            <div className="div-3">
                <div className="overlap">
                    <img
                        className="group-2"
                        alt="Group"
                        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-30@2x.png"
                    />

                    <div className="rectangle-2" />

                    <div className="text-wrapper-3">Baby Name</div>

                    <img
                        className="vector-2"
                        alt="Vector"
                        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector.svg"
                    />
                </div>

                <div className="ios-status-bar-black-2">
                    <div className="right-side-2">
                        <img
                            className="battery-2"
                            alt="Battery"
                            src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/battery-1@2x.png"
                        />

                        <img
                            className="wifi-2"
                            alt="Wifi"
                            src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/wifi-1.svg"
                        />

                        <img
                            className="mobile-signal-2"
                            alt="Mobile signal"
                            src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/mobile-signal-1.svg"
                        />
                    </div>

                    <img
                        className="left-side-2"
                        alt="Left side"
                        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/left-side-1@2x.png"
                    />
                </div>

                <img
                    className="group-3"
                    alt="Group"
                    src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-5@2x.png"
                />

                <div className="overlap-group-2">
                    <div className="text-wrapper-4">Baby Age</div>

                    <img
                        className="vector-3"
                        alt="Vector"
                        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector.svg"
                    />
                </div>

                <div className="overlap-2">
                    <div className="text-wrapper-5">Email</div>

                    <img
                        className="vector-4"
                        alt="Vector"
                        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector-3.svg"
                    />
                </div>

                <div className="overlap-3">
                    <img
                        className="vector-5"
                        alt="Vector"
                        src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/vector-2.svg"
                    />

                    <div className="text-wrapper-6">Password</div>
                </div>
            </div>
        </div>
    );
};

export default StartScreen