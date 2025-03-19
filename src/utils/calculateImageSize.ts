export const calculateImageSize = (width, height, boxSize) => {
    let newHeight, newWidth, minTransX, minTransY

    const widthRate = width / height

    if (widthRate >= 1) {
        ;[newWidth, newHeight] = [widthRate * boxSize, boxSize]
        ;[minTransX, minTransY] = [((newWidth - boxSize) / newWidth) * 100, 0]
    } else {
        ;[newWidth, newHeight] = [boxSize, boxSize / widthRate]
        ;[minTransX, minTransY] = [0, ((newHeight - boxSize) / newHeight) * 100]
    }

    return { newHeight, newWidth, minTransX, minTransY }
}
