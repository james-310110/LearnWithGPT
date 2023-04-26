1. `conda env create -f environment.yml`
2. `conda activate learn-with-gpt`
3. Run the server `python manage.py runserver`
4. go to http://127.0.0.1:8000/{endpoint}
   1. try something like `http://127.0.0.1:8000/getdata?data={%22filelist%22:%20[%22fa%22,%20%22fb%22],%20%22linklist%22:%20[%22.com%22,%20%22.edu%22],%20%22query%22:%20%22qqq%22,%20%22format%22:%20%22html%22}`
5. For testing, `python manage.py test --verbosity=1`
6. `main/testdata`: files for testing; `main/urls.py`: define endpoint; `main/views.py`: define endpoint handlers; `main/tests.py`: testing endpoints
7. each time model changed `python manage.py makemigrations && python manage.py migrate`
