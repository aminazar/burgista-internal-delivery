UPDATE prices SET valid_to = ${changeDate} where product_id = ${product_id} and valid_to IS NULL;
INSERT INTO "prices"("product_id","price","valid_from","valid_to")
VALUES (${product_id},${newPrice},${changeDate},null) returning price_id;