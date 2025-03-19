import { useState, useEffect } from 'react'

export default function useSettingBar(
    minVal,
    maxVal,
    setRate,
    value,
    barWidth,
) {
    useEffect(() => {
        const rate =
            minVal + ((maxVal - minVal) * (value - minVal)) / (maxVal - minVal)

        if (rate >= maxVal) setRate(maxVal)
        else if (rate < minVal) setRate(minVal)
        else if (minVal === maxVal) setRate(minVal)
        else setRate(rate)
    }, [maxVal])

    const [mouseDown, setMouseDown] = useState(false)

    const handleBarMove = (e) => {
        if (!mouseDown) return
        const rate =
            (maxVal - minVal) * (e.nativeEvent.offsetX / barWidth) + minVal

        setRate(rate)
    }

    const handleMouseDown = () => {
        setMouseDown(true)
    }

    const handleMouseClear = () => {
        setMouseDown(false)
    }

    let barRate = (value - minVal) / (maxVal - minVal)
    let isDisable = false

    if (isNaN(barRate)) {
        barRate = minVal
        isDisable = true
    }

    return {
        handleBarMove,
        handleMouseClear,
        handleMouseDown,
        barRate,
        isDisable,
    }
}
