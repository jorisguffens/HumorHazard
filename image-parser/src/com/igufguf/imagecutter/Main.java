package com.igufguf.imagecutter;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.CropImageFilter;
import java.awt.image.FilteredImageSource;
import java.awt.image.ImageProducer;
import java.io.File;
import java.io.IOException;

/**
 * Created by Joris on 01/03/2018 in project ImageCutter.
 */
public class Main {

    public static void main(String[] args) {
        String path = "D:\\Users\\Joris\\Desktop\\imagetest\\";

        File directory = new File(path + "pages");

        int cardid = 1;

        int offsetY = 148;
        int offsetX = 180;

        int width = 444;
        int height = 630;

        try {
            File[] pages = directory.listFiles();
            for (File page : pages) {
                BufferedImage in = ImageIO.read(page);

                for (int row = 0; row < 3; row++) {
                    for (int column = 0; column < 3; column++) {

                        int x = offsetX + (column * 5) + (column * width);
                        int y = offsetY + (row * 5) + (row * height);

                        ImageProducer producer = new FilteredImageSource(in.getSource(), new CropImageFilter(x, y, width, height));
                        Image image = Toolkit.getDefaultToolkit().createImage(producer);

                        BufferedImage out = toBufferedImage(image);

                        File write = new File(path + "card" + String.format("%03d", cardid) + ".png");
                        ImageIO.write(out, "png", write);

                        cardid++;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static BufferedImage toBufferedImage(Image img) {
        if (img instanceof BufferedImage) {
            return (BufferedImage) img;
        }

        // Create a buffered image with transparency
        BufferedImage bimage = new BufferedImage(img.getWidth(null), img.getHeight(null), BufferedImage.TYPE_INT_ARGB);

        // Draw the image on to the buffered image
        Graphics2D bGr = bimage.createGraphics();
        bGr.drawImage(img, 0, 0, null);
        bGr.dispose();

        // Return the buffered image
        return bimage;
    }

}
