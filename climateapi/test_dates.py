import pytest
import utils
import datetime as dt

testdata = [
"2020-10-13T12:50:23Z", 
"2021-06-14T13:09:52.4Z",
"2021-07-01T13:09:00.78Z",
"2021-10-31T00:59:55.445Z",
"2021-11-13T12:59:55.98273Z"
]
@pytest.mark.parametrize("test_input", testdata)
def test_date(test_input):
    assert type(utils.parseDate(test_input)) is dt.datetime
